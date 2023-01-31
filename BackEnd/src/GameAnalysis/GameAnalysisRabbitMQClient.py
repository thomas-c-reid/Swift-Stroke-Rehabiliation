#!/usr/bin/env python

import pika
import time

import getIndividualGameResult

def callback(ch, method, properties, body):
    #print(" [x] %r:%r" % (method.routing_key, body))
    analysedData = analyseData(body)
    sendResult(analysedData)


# Any data analysis will be done in this method
# THIS WILL TAKE IN RESULT ND ARRAY OF JSONS
def analyseData(body):
    # finalJson = getIndividualGameResult.getIndividualResults(str(body))
    resultsJson = getIndividualGameResult.getIndividualResults(body)
    stringJson = str(resultsJson)
    finalStringJson = stringJson.replace("'","\"") 
    print(finalStringJson)
    # Where the data analysis will happen
    return finalStringJson


# Sending the result back to the C# ASP.NET Web API
def sendResult(analysisResult):
    time.sleep(2);
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()

    channel.exchange_declare(exchange='swift_rehab_app', exchange_type='topic')

    routing_key = 'game.toC#'
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

channel.queue_bind(exchange='swift_rehab_app', queue=queue_name, routing_key='game.score.fromApp')

print(' [*] Waiting for tasks.')

channel.basic_consume(queue = queue_name, on_message_callback=callback, auto_ack=True)

channel.start_consuming()
