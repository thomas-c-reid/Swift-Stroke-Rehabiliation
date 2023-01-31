#!/usr/bin/env python

from azure.servicebus import ServiceBusClient, ServiceBusMessage
import time
import threading

CONNECTION_STR = ""
TOPIC_NAME = "gametopython"
SUBSCRIPTION_NAME = "GameToPythonSubscription"

def send_single_message(sender, analysisResult):
    # create a Service Bus message
    message = ServiceBusMessage(analysisResult)
    # send the message to the queue
    sender.send_messages(message)
    print("Sent a single message")

def callback(body):
    analysedData = analyseData(body)
    sendResult(analysedData)


# Any data analysis will be done in this method
def analyseData(body):
    print("Data is being analysed: " + str(body))
    # Where the data analysis will happen
    return "Analysed data"


# Sending the result back to the C# ASP.NET Web API
def sendResult(analysisResult):
    servicebus_client = ServiceBusClient.from_connection_string(conn_str=CONNECTION_STR, logging_enable=True)
    with servicebus_client:
        sender = servicebus_client.get_topic_sender(topic_name=TOPIC_NAME)
        with sender:        
            send_single_message(sender, analysisResult)

    print("Done sending messages from python")

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
