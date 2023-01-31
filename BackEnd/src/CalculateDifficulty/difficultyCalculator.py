import random
import json

threshold = 80


# Take in all the results
# Based on last results difficulty and accuracy 
# return new game difficulty

def getNewGameDifficulty(byteArray):
    if isinstance(byteArray, bytes):
        jsonArray = convertToJsonArray(byteArray)
        lastGameDifficulty = jsonArray[-1]["difficulty"]
        lastGameAccuracy = jsonArray[-1]["accuracy"]
        print("game results")
        print(lastGameAccuracy)
        print(lastGameDifficulty)

        newGameDifficulty = calculateDifficulty(lastGameAccuracy, lastGameDifficulty)
        print(newGameDifficulty)
        tempJson = {"newDifficulty": newGameDifficulty}
    else:
        tempJson = {"Error": "could not retrieve data"}
    return tempJson

def calculateDifficulty(lastGameAccuracy, lastGameDifficulty):
    if type(lastGameAccuracy) == int and type(lastGameDifficulty) == int:
        difficultyChange = 0
        if lastGameAccuracy < 10:
            difficultyChange = -5
        elif lastGameAccuracy < 20:
            difficultyChange = -4
        elif lastGameAccuracy < 30:
            difficultyChange = -3
        elif lastGameAccuracy < 40:
            difficultyChange = -2
        elif lastGameAccuracy < 50:
            difficultyChange = -1
        elif lastGameAccuracy == 50:
            difficultyChange = 0
        elif lastGameAccuracy < 60:
            difficultyChange = 1
        elif lastGameAccuracy < 70:
            difficultyChange = 2
        elif lastGameAccuracy < 80:
            difficultyChange = 3
        elif lastGameAccuracy < 90:
            difficultyChange = 4
        else:
            difficultyChange = 5
        
        if difficultyChange + lastGameDifficulty > 100:
            newGameDifficulty = 100
        elif lastGameDifficulty + difficultyChange < 0:
            newGameDifficulty = 0
        else:
            newGameDifficulty = difficultyChange + lastGameDifficulty
    else:
        return {"error": "could not read last game data"}
    return newGameDifficulty

def convertToJsonArray(largeArrayOfBytes):
    if isinstance(largeArrayOfBytes, bytes):
        finalArray = []
        stringJsonArray = []
        decodedJsonArray = largeArrayOfBytes.decode('utf8').replace("'", '"')
        replacedJsonArray = decodedJsonArray.replace("}", "{")
        splitJsonArray = replacedJsonArray.split("{")
        count = 1
        for tempStringJson in splitJsonArray:
            jsonToBeAdded = " {{ {} }}".format(tempStringJson)
            # print(jsonToBeAdded)
            if count % 2 == 0:
                stringJsonArray.append(jsonToBeAdded)
            count += 1

        for stringJson in stringJsonArray:
            tempJson = json.loads(stringJson)
            finalArray.append(tempJson)
    else:
        return {"error": "could not read data"}
    return finalArray