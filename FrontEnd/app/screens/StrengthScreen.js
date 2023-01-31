//dependencies
import React, { useEffect, useState, useContext } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  View,
  Text,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";

//ui
//import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/AntDesign";

//camera
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

//video preview
import { Video } from "expo-av";

//return value
import postVideo from "../functions/FileUpload";

//app context
import AppContext from "../constants/AppContext";

// The strength screen written by the previous year group, it records a video, saves it to the device and then tries to upload it to the back end


export default function StrengthScreen({ navigation }) {
  //key values to be replaced
  //const value pairs
  /*
  Permissions
 */
  //use app context
  const context = useContext(AppContext);
  //modal state
  const [modalState, setModalState] = useState(true);
  //camera object
  const [camera, setCamera] = useState(null);
  //use if focused to mount/ unmout camera
  //const isFocused = useIsFocused();
  //type of camera (front or back)
  const [type, setType] = useState(Camera.Constants.Type.back);

  /*
  App cycle status', allowing for transitions between each ap state

  App states of;

  Default screen -  able to record video and access navigation to settings etc
  Reveiwing -  where video may be reviewed prior to upload
  Awaiting - Where usr awaits return of results from server (Openpose)
*/

  //if currently recording or not
  const [recording, setRecording] = useState(false);
  //if video has been recorded (therefore ready for upload)
  const [recorded, setRecorded] = useState(false);
  //if currently awaitng response form server
  const [awaiting, setAwaiting] = useState(false);
  //if user wishes to access tutorial
  const [tutorial, setTutorial] = useState(false);

  //when to refresh status of reviewing pane (when recorded video loops)
  //location of videofile (filepath)
  const [videoFile, setVideoFile] = useState("dummy");
  //so video plays in preview window
  const shouldPlay = true;

  //device screen ratio

  //padding (empty space) around image/ pane to be displayed
  const [imagePadding, setImagePadding] = useState(0);
  //aspect ratio of camera viewer
  const [ratio, setRatio] = useState("4:3");
  //dimensions of device display
  const { height, width } = Dimensions.get("window");
  //device screen ratio
  const screenRatio = height / width;
  //guard on ratio being set, defaults to 4:3 but should still be set on initial boot
  const [isRatioSet, setIsRatioSet] = useState(false);

  /**
   * Permission Logic
   */

  //camera permissions
  useEffect(() => {
    async function getCameraStatus() {
      if (!context.cameraPermission) {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status === "granted") {
          context.toggleCameraPermssion();
        } else {
          context.setCameraPermission(false);
        }
      }
    }
    getCameraStatus();
  }, []);

  //storage permissions
  useEffect(() => {
    async function getStorageStatus() {
      if (!context.storagePermission) {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
          context.toggleStoragePermssion();
        } else {
          context.setStoragePermission(false);
        }
      }
    }
    getStorageStatus().catch(function () {
      console.log("Storage Promise rejected");
    });
  }, []);

  //audio permissions (not strictly required but may result n stability if not handled)
  useEffect(() => {
    async function getAudioStatus() {
      if (!context.audioPermission) {
        const { status } = await Camera.requestMicrophonePermissionsAsync();
        if (status === "granted") {
          context.toggleAudioPermssion();
        } else {
          context.setAudioPermission(false);
        }
      }
    }
    getAudioStatus();
  }, []);

  /**
   * Camera Initialisation
   */

  //set camera ratio (assuming portrait video oreintation)
  const prepareRatio = async () => {
    let desiredRatio = "4:3";

    //specify if android (future proofing)
    if (Platform.OS === "android") {
      const ratios = await camera.getSupportedRatiosAsync();

      //find each supported ratio
      //use loop to find minimal difference between desired (4:3) and supported ratio
      let distances = {};
      let realRatios = {};
      let minDistance = null;
      for (const ratio of ratios) {
        const parts = ratio.split(":");
        const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
        realRatios[ratio] = realRatio;
        const distance = screenRatio - realRatio;
        distances[ratio] = realRatio;
        if (minDistance == null) {
          minDistance = ratio;
        } else {
          if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio;
          }
        }
      }
      //select best match
      desiredRatio = minDistance;
      //design padding to compensate for difference
      //calc difference in height
      let remainder = Math.floor(
        (height - realRatios[desiredRatio] * width) / 2
      );
      if (remainder < 0) {
        remainder = 0;
      }
      //set padding
      setImagePadding(remainder / 2);
      setRatio(desiredRatio);
      //return float of ratio used
      //setCameraRatioUsed = realRatios[desiredRatio];
      //setting flag so this isnt calculated every frame
      setIsRatioSet(true);
    }
  };

  //camera ready guard
  const setCameraReady = async () => {
    if (!context.cameraPermission) {
      getCameraStatus();
    }
    if (!isRatioSet) {
      await prepareRatio();
    }
  };

  /**
   * Image Capture and Store
   */

  //record video
  const takeVideo = async () => {
    if (!camera || !context.cameraPermission) return;
    if (!recording) {
      setRecording(true);
      let { uri } = await camera.recordAsync({
        maxDuration: 60,
        quality: "480p",
      });

      console.log("video", uri);
      saveAsset(uri);
    } else {
      setRecording(false);
      camera.stopRecording();
      setRecorded(true);
    }
  };

  //saves recording to file system
  function saveAsset(path) {
    MediaLibrary.saveToLibraryAsync(path);
    setVideoFile(path);
    console.log(MediaLibrary.getAssetsAsync());
  }

  function getAsset() {
    return videoFile;
  }

  //flip whether pop up is shown
  const displayModal = (show) => {
    setModalState(show);
  };

  /**
   * what is drawn to screen
   * react-native return statement, acting as a draw method
   * if else structure used with state guards above to ensure correct app screen is displayed
   */

  //incase of camera permission failures
  if (!context.cameraPermission) {
    return (
      <View>
        <Modal animationType={"slide"} transparent={true} visible={modalState}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate("Home2");
              }}
            >
              <Text style={styles.buttonText}>
                Allow Permissions in Settings
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  //} else if (context.cameraPermission && isFocused) {
  } else if (context.cameraPermission) {
    if (recorded) {
      //if video has ben recorded and preped fro upload
      return (
        <SafeAreaView style={styles.container}>
          {/*video preview prior to uploading*/}
          <Video
            ref={(ref) => {
              setVideoFile(ref);
            }}
            style={styles.camera}
            source={{ uri: getAsset() }}
            resizeMode="cover"
            useNativeControls
            isLooping
            shouldPlay={shouldPlay}
          />
          <View style={styles.buttons}>
            {/*cancel button, returns to camera viewer, cancelling upload
                video deletion component required*/}
            <Button
              title="Cancel"
              onPress={() => {
                //drop video file
                setRecorded(false);
                setAwaiting(false);
              }}
            />
            {/*upload button*/}
            <Button
              title="Upload"
              onPress={() => {
                console.log("Sending video to server");
                //upload to server
                postVideo(videoFile);
                setRecorded(false);
                setAwaiting(true);
              }}
            />
          </View>
        </SafeAreaView>
      );

      //if waiting on resuts form the server
    } else if (awaiting) {
      return (
        <View style={styles.container}>
          <Modal
            animationType={"slide"}
            transparent={true}
            visible={modalState}
          >
            <View style={styles.modalView}>
              <Text>dummy message - where frames should be displayed</Text>
              <Text>{context.prediction}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  displayModal(!modalState);
                  setAwaiting(false);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      );
    }

    //tutorial using camera viewer (to be implemented)
    else if (tutorial) {
    } else {
      //if video not captured and not waiting on resuts of previous submission
      //default state on startup
      return (
        <SafeAreaView style={styles.container}>
          <Camera
            style={styles.camera}
            type={type}
            ref={(ref) => {
              setCamera(ref);
            }}
            onCameraReady={setCameraReady}
            ratio={ratio}
          >
            <View style={styles.upperButtons}>
              <TouchableOpacity
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                <Icon size={30} name="swap" color="white"></Icon>
              </TouchableOpacity>

              <TouchableOpacity onPress={takeVideo}>
                <Icon
                  size={30}
                  name="videocamera"
                  color={recording ? "red" : "white"}
                ></Icon>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SettingsScreen");
                }}
              >
                <Icon size={30} name="setting" color="white"></Icon>
              </TouchableOpacity>
            </View>
          </Camera>
        </SafeAreaView>
      );
    }
  } else {
    return null;
  }
}

//stylesheet (essentially fucntions the same as css in classic web dev)
const styles = StyleSheet.create({
  home: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  upperButtons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: "5%",
    alignItems: "flex-end",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  modalView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
    marginTop: Dimensions.get("window").height * 0.3,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    elevation: 8,
    width: Dimensions.get("window").width * 0.8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: Dimensions.get("window").height * 0.05,
  },
  buttonText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
  },
});
