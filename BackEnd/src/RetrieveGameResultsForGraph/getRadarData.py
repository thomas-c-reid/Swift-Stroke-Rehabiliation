import json
#import pytest
from datetime import timedelta, datetime

today = datetime.today()
weekAgo = today - timedelta(days=6)
weekPlusOne = weekAgo + timedelta(days=1)
weekMinusOne = weekAgo - timedelta(days=1)

emptyJson = {"engagement": 0, "time": 0, "accuracy": 0, "difficulty": 0}

# Getting Each of the individual results ------------------------------------------
def returnAvgAccuracy(JsonArray):
    if len(JsonArray) != 0:
        AccuracyTotal = 0
        count = 0
        for json in JsonArray:
            if "accuracy" in json:
                tempDate = convertStringToDate(json)
                if tempDate >= weekAgo:
                    count += 1
                    AccuracyTotal += int(json["accuracy"])
        if count > 0:
            avgAccuracy = AccuracyTotal / count
        else:
            avgAccuracy = 0
    else: avgAccuracy = 0
    return avgAccuracy


def returnAvgTime(JsonArray):
    TimeTotal = 0
    count = 0
    for json in JsonArray:
        if "timeTaken" in json:
            tempDate = convertStringToDate(json)
            if tempDate >= weekAgo:
                count += 1
                TimeTotal += int(json["timeTaken"])
    if count > 0:
        avgAccuracy = TimeTotal / count
    else:
        avgAccuracy = 0
    return avgAccuracy


def returnAvgDifficulty(JsonArray):
    difficultyTotal = 0
    count = 0
    for json in JsonArray:
        if "difficulty" in json:
            tempDate = convertStringToDate(json)
            if tempDate >= weekAgo:
                count += 1
                difficultyTotal += int(json["difficulty"])
        else:
            print(json)
            avgDifficulty = 0
            break
    if count > 0:
        avgDifficulty = difficultyTotal / count
    else:
        avgDifficulty = 0
    return avgDifficulty


def returnEngagement(JsonArray):
    datesArray = []
    for json in JsonArray:
        tempDate = convertStringToDate(json)
        if tempDate == -1:
            finalValue = "could not accurately retrieve results"
            break
        datesArray.append(tempDate)
    finalArray = removeDuplicateDates(datesArray)
    finalValue = len(finalArray)
    return finalValue


# MiniFunctions -------------------------------------------------------------------
def isIn(dateObject, dateArray):
    for dateToCheck in dateArray:
        if dateToCheck == dateObject:
            return True
    return False


def removeDuplicateDates(datesArray):
    finalDatesArray = []
    for dateInArray in datesArray:
        if not isIn(dateInArray, finalDatesArray) and dateInArray >= weekAgo:
            finalDatesArray.append(dateInArray)
    finalDatesArray.sort()
    return finalDatesArray


def constructJsonRadar(time, accuracy, engagement, difficulty):
    json = {"engagement": engagement, "time": time, "accuracy": accuracy, "difficulty": difficulty}
    return json


def convertToJsonArray(largeArrayOfBytes):
    finalArray = []

    if isinstance(largeArrayOfBytes, bytes):
        # copy code
        stringJsonArray = []
        decodedJsonArray = largeArrayOfBytes.decode('utf8').replace("'", '"')
        replacedJsonArray = decodedJsonArray.replace("}", "{")
        splitJsonArray = replacedJsonArray.split("{")
        count = 1
        for tempStringJson in splitJsonArray:
            jsonToBeAdded = " {{ {} }}".format(tempStringJson)
            if count % 2 == 0:
                stringJsonArray.append(jsonToBeAdded)
            count += 1

        for stringJson in stringJsonArray:
            tempJson = json.loads(stringJson)
            finalArray.append(tempJson)
    return finalArray


def convertStringToDate(json):
    if "DateAddedToDb" in json:
    # copy code over
        jsonMonth = json["DateAddedToDb"][0:2]
        jsonDay = json["DateAddedToDb"][3:5]
        jsonYear = json["DateAddedToDb"][6:10]
        tempDate = datetime(year=int(jsonYear), month=int(jsonMonth), day=int(jsonDay))
    else:
        tempDate = -1
    return tempDate


# MAIN FUNCTIONS-------------------------------------------------------------------
def getRadarData(largeArrayOfJsons):
    if isinstance(largeArrayOfJsons, bytes):
        officialJsonArray = convertToJsonArray(largeArrayOfJsons)
        avgAccuracy = returnAvgAccuracy(officialJsonArray)
        avgTime = returnAvgTime(officialJsonArray)
        weeklyEngagement = returnEngagement(officialJsonArray)
        avgDifficulty = returnAvgDifficulty(officialJsonArray)
        avgAccuracy = round(avgAccuracy,0)
        avgTime = round(avgTime, 0)
        avgDifficulty = round(avgDifficulty, 0)
        radarJson = constructJsonRadar(avgTime, avgAccuracy, weeklyEngagement, avgDifficulty)
        print(radarJson)
    else:
        return emptyJson
    return radarJson
