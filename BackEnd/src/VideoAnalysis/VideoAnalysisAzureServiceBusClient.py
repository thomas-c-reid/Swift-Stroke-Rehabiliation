#!/usr/bin/env python

from azure.servicebus import ServiceBusClient, ServiceBusMessage
import time
import base64
import cv2
import pickle
import json
import glob
import os
from PIL import Image
import shutil
import numpy as np
import mediapipe as mp

###############CONSTANTS###############
LEFT_WRIST_KEYPOINT_INDEX = 15
RIGHT_WRIST_KEYPOINT_INDEX = 16
SAVING_FRAMES_PER_SECOND = 2
DRIFT_THRESHOLD = 0.047
CONNECTION_STR = ""
TOPIC_NAME = "videotopython"
SUBSCRIPTION_NAME = "VideoToPythonSubscription"


# Getting the body of the request from rabbitmq
def callback(body):
    saveVideoFile(body)

    analysisResult = run_script("/src/VideoAnalysis/Video.mp4")
    print("Analysis result: " + analysisResult)
    print("Sending result back to the C# Web API")
    sendResult(analysisResult)

# Any data analysis will be done in this method
def saveVideoFile(body):
    print("Saving video file to directory in python")
    with open("/src/VideoAnalysis/Video.mp4", 'wb')as file:
        file.write(body)
        file.close()

# Sending a single message to the azure service bus
def send_single_message(sender, analysisResult):
    # create a Service Bus message
    message = ServiceBusMessage(analysisResult)
    # send the message to the queue
    sender.send_messages(message)
    print("Sent a single message")
        


# Sending the result back to the C# ASP.NET Web API
def sendResult(analysisResult):
    servicebus_client = ServiceBusClient.from_connection_string(conn_str=CONNECTION_STR, logging_enable=True)
    with servicebus_client:
        sender = servicebus_client.get_topic_sender(topic_name=TOPIC_NAME)
        with sender:        
            send_single_message(sender, analysisResult)

    print("Done sending messages from python")



############ Analysing the video files ##############

def extract_flagged_frames(keypoints):
    start_keypoint = keypoints[0]
    keypoint_differences = []
    flagged_frames = []

    for idx in range(0,len(keypoints)):
        calc = abs(start_keypoint - keypoints[idx])
        keypoint_differences.append(calc)

    for frame in range(0,len(keypoint_differences)):
        if keypoint_differences[frame] >= DRIFT_THRESHOLD:
            flagged_frames.append(frame)

    return flagged_frames


def run_weakness_detection(left_wrist_keypoints, right_wrist_keypoints):

    left_flagged_frames = extract_flagged_frames(left_wrist_keypoints)

    right_flagged_frames = extract_flagged_frames(right_wrist_keypoints)


    if os.path.exists('impairedweaknessmodel.sav'):
        model_filename = "/src/VideoAnalysis/impairedweaknessmodel.sav"
    else:
        model_filename = "/src/VideoAnalysis/impairedweaknessmodel.sav"
    
    model = pickle.load(open(model_filename, 'rb'))
    weakness_prediction = model.predict([[len(left_flagged_frames),len(right_flagged_frames)]])

    return weakness_prediction, left_flagged_frames, right_flagged_frames

def run_mediapipe_pose(filename):

    mp_drawing = mp.solutions.drawing_utils
    mp_pose = mp.solutions.pose
    cap = cv2.VideoCapture(filename)
    frame_count = 0
    left_wrist_keypoints = []
    right_wrist_keypoints = []
    
    # initiate pose model
    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    
        while cap.isOpened():
            
            ret, frame = cap.read()

            # if no frames left to read, exit loop
            if not ret:
                break

            frame_count = frame_count + 1
        
            # recolor Feed
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            # make Detections
            results = pose.process(image)
            
            # recolor image back to BGR for rendering
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            left_wrist_keypoints.append(results.pose_landmarks.landmark[LEFT_WRIST_KEYPOINT_INDEX].y)
            right_wrist_keypoints.append(results.pose_landmarks.landmark[RIGHT_WRIST_KEYPOINT_INDEX].y)

            if cv2.waitKey(10) & 0xFF == ord('q'):
                break

    cap.release()
    cv2.destroyAllWindows()

    return left_wrist_keypoints, right_wrist_keypoints

def save_flagged_frames(left_frame_ids, right_frame_ids, folder):

    frameids = left_frame_ids + right_frame_ids

    # create the directory to store flagged frames
    flagged_frames_folder = folder + '-flagged-frames'
    if not os.path.isdir(flagged_frames_folder):
        os.mkdir(flagged_frames_folder)

    # search for and save flagged frames in directory created above
    for frame in glob.iglob(f'{folder}/*.jpg'):
        for id in frameids:
            if frame.endswith(f'frame{id}.jpg'):
                frame_to_save = Image.open(frame)
                frame_to_save = frame_to_save.save(f'{flagged_frames_folder}/frame{id}.jpg')

    # remove the saved frames folder as it is no longer useful


# Get directory name


    try:
        shutil.rmtree(folder)
    except OSError as e:
        print("Error: %s - %s." % (e.filename, e.strerror))


# run_script(filename) is a method called by the flask server to invoke the MediaPipe Pose ML pipeline and weakness detection on a specified
# input video "filename"

def run_script(filename):

    folder_name, _ = os.path.splitext(filename)

    if not filename.endswith('-reduced-frames.avi'):

        folder_name += '-reduced-frames'

        # create reduced frames video
        frame_width, frame_height = create_reduced_frames_video(filename)

        frameSize = (frame_width, frame_height)

        out = cv2.VideoWriter(f'{folder_name}.avi',cv2.VideoWriter_fourcc(*'DIVX'), 60, frameSize)

        for imgfile in glob.glob(f'{folder_name}/*.jpg'):
            img = cv2.imread(imgfile)
            out.write(img)

        out.release()

    left_wrist_keypoints, right_wrist_keypoints = run_mediapipe_pose(f'{folder_name}.avi')

    if(len(left_wrist_keypoints) != 0 and len(right_wrist_keypoints) != 0):
        weakness_prediction, left_flagged_frames, right_flagged_frames = run_weakness_detection(left_wrist_keypoints, right_wrist_keypoints)

        save_flagged_frames(left_flagged_frames, right_flagged_frames, folder_name)

        output = {        
            'video-name' : filename,
            'start-y-coord-left': str(left_wrist_keypoints[0]),
            'flagged-frames-left-weakness': len(left_flagged_frames),
            'left-flagged-frame-IDs': left_flagged_frames,
            'start-y-coord-right': str(right_wrist_keypoints[0]),
            'flagged-frames-right-weakness': len(right_flagged_frames),
            'right-flagged-frame-IDs': right_flagged_frames,
            'weakness-prediction': str(weakness_prediction)        
        }
    
        # return output to the flask server -> app
        formatted_outcome = json.dumps(output, indent=4)
        return formatted_outcome
    else:
        output = {
            'Error' : 'invalid video filename'
        }

        # return output to the flask server -> app
        formatted_outcome = json.dumps(output, indent=4)
        return formatted_outcome    

######### Reducing the saved frames##############
def format_timedelta(td):
    """Utility function to format timedelta objects in a cool way (e.g 00:00:20.05) 
    omitting microseconds and retaining milliseconds"""
    result = str(td)
    try:
        result, ms = result.split(".")
    except ValueError:
        return result + ".00".replace(":", "-")
    ms = int(ms)
    ms = round(ms / 1e4)
    return f"{result}.{ms:02}".replace(":", "-")


def get_saving_frames_durations(cap, saving_fps):
    """A function that returns the list of durations where to save the frames"""
    s = []
    # get the clip duration by dividing number of frames by the number of frames per second
    
    clip_duration = cap.get(cv2.CAP_PROP_FRAME_COUNT) / cap.get(cv2.CAP_PROP_FPS)
    # use np.arange() to make floating-point steps
    for i in np.arange(0, clip_duration, 1 / saving_fps):
        s.append(i)
    return s

def create_reduced_frames_video(video_file):
    filename, _ = os.path.splitext(video_file)
    filename += "-reduced-frames"
    # make a folder by the name of the video file
    if not os.path.isdir(filename):
        os.mkdir(filename)
    # read the video file    
    cap = cv2.VideoCapture(video_file)
    # get the FPS of the video
    fps = cap.get(cv2.CAP_PROP_FPS)

    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    # if the SAVING_FRAMES_PER_SECOND is above video FPS, then set it to FPS (as maximum)
    saving_frames_per_second = min(fps, SAVING_FRAMES_PER_SECOND)
    # get the list of duration spots to save
    saving_frames_durations = get_saving_frames_durations(cap, saving_frames_per_second)
    # start the loop
    count = 0
    saved_frame_counter = 0
    while True:
        is_read, frame = cap.read()
        if not is_read:
            # break out of the loop if there are no frames to read
            break
        # get the duration by dividing the frame count by the FPS
        frame_duration = count / fps
        try:
            # get the earliest duration to save
            closest_duration = saving_frames_durations[0]
        except IndexError:
            # the list is empty, all duration frames were saved
            break
        if frame_duration >= closest_duration:
            # if closest duration is less than or equals the frame duration, 
            # then save the frame
            cv2.imwrite(os.path.join(filename, f"frame{saved_frame_counter}.jpg"), frame)
            saved_frame_counter = saved_frame_counter + 1
            # drop the duration spot from the list, since this duration spot is already saved
            try:
                saving_frames_durations.pop(0)
            except IndexError:
                pass
        # increment the frame count
        count += 1
    return frame_width,frame_height

## Receiving data from the C# Web API for analysis
print("-------- [*] Receiving messages ------------")
flag = True
while(flag):
    time.sleep(5);
    servicebus_client = ServiceBusClient.from_connection_string(conn_str=CONNECTION_STR, logging_enable=True)
    with servicebus_client:
        # get the Queue Receiver object for the queue
        receiver = servicebus_client.get_subscription_receiver(topic_name=TOPIC_NAME, subscription_name=SUBSCRIPTION_NAME, max_wait_time=5)
        with receiver:
            for msg in receiver:
                print("Received: " + str(msg))
                # complete the message so that the message is removed from the queue
                receiver.complete_message(msg)
                body = msg
                callback(body)
                flag = False
