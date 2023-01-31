import json
from datetime import datetime
from statistics import mean


# MiniFunctions -------------------------------------------------------------------
def isIn(dateObject, dateArray):
    for dateToCheck in dateArray:
        if dateToCheck == dateObject:
            return True
    return False


def constructJsonHistoric(date, average):
    dateFormatted = date.strftime("%d/%m/%Y")
    json = {"date": dateFormatted, "average": average}
    return json


def convertStringToDate(jsonString):
    if isinstance(jsonString, str):
        numberString = jsonString[0:2] + jsonString[3:5] + jsonString[6:10]
        ans = all(char.isdigit() for char in numberString)
        if ans:
            jsonMonth = jsonString[0:2]
            jsonDay = jsonString[3:5]
            jsonYear = jsonString[6:10]
            if int(jsonMonth) >= 0 and int(jsonMonth) <= 12 and int(jsonDay) >= 0 and int(jsonDay) <= 31:
                tempDate = datetime(year=int(jsonYear), month=int(jsonMonth), day=int(jsonDay))
            else:
                tempDate = datetime.now
        else:
            tempDate = datetime.now
    else:
        tempDate = datetime.now
    return tempDate


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
            if count % 2 == 0:
                stringJsonArray.append(jsonToBeAdded)
            count += 1

        for stringJson in stringJsonArray:
            tempJson = json.loads(stringJson)
            finalArray.append(tempJson)
    else:
        finalArray = []
    return finalArray


# MAIN FUNCTION-----------------------------------------------------------
def getTimeHistoric(largeArrayOfJsons):
    if isinstance(largeArrayOfJsons, bytes):
        datesArray = []
        finalJsons = []
        officialJsonArray = convertToJsonArray(largeArrayOfJsons)
        for json in officialJsonArray:
            if not isIn(json["DateAddedToDb"], datesArray):
                datesArray.append(json["DateAddedToDb"])

        datesArray.sort()

        for dateIndex in range(len(datesArray)):
            dailyTimes = []
            date1 = convertStringToDate(datesArray[dateIndex])
            for dateToCheckIndex in range(len(officialJsonArray)):
                date2 = convertStringToDate(officialJsonArray[dateToCheckIndex]["DateAddedToDb"])
                if date1 == date2:
                    dailyTimes.append((officialJsonArray[dateToCheckIndex]["timeTaken"]))
            dailyAverage = mean(dailyTimes)
            json = constructJsonHistoric(date1, dailyAverage)
            finalJsons.append(json)
    else:
        finalJsons = []
    return finalJsons