#!/usr/bin/env python
from pprint import pprint

import getResults
import pika
import time
import gameScores


def callback(ch, method, properties, body):
    analysedData = analyseData(body)
    sendResult(analysedData)


# Any data analysis will be done in this method
def analyseData(body):
    print(body)
    results = getResults.getResultsJson(body)
    stringJson = str(results)
    finalStringJson = stringJson.replace("'","\"") 
    return finalStringJson
    

# Sending the result back to the C# ASP.NET Web API
def sendResult(analysisResult):
    time.sleep(2);
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()

    channel.exchange_declare(exchange='swift_rehab_app', exchange_type='topic')

    routing_key = 'results.toC#'
    message = analysisResult

    channel.basic_publish(exchange='swift_rehab_app', routing_key=routing_key, body=message)
    print("Sending message to c#: " + str(channel))
    connection.close()


time.sleep(20)
connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
channel = connection.channel()

channel.exchange_declare(exchange='swift_rehab_app', exchange_type='topic')

result = channel.queue_declare('', exclusive=True)
queue_name = result.method.queue

channel.queue_bind(exchange='swift_rehab_app', queue=queue_name, routing_key='game.results.fromApp')

print(' [*] Waiting for tasks.')

channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)

channel.start_consuming()
