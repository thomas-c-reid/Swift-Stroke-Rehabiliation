import statistics
import json

# InputGameResults = {"UserID": 1, "accuracy": 30, "time": 1, "level": "x", "difficulty": "x", "date": "05/10/22"}

# InputArray1 = {"UserID": 1, "accuracy": 30, "time": 1, "level": "x", "difficulty": "x", "date": "05/10/22"}
# InputArray2 = {"UserID": 1, "accuracy": 30, "time": 1, "level": "x", "difficulty": "x", "date": "05/10/22"}
# InputArray3 = {"UserID": 1, "accuracy": 30, "time": 1, "level": "x", "difficulty": "x", "date": "05/10/22"}
# InputArray4 = {"UserID": 1, "accuracy": 30, "time": 1, "level": "x", "difficulty": "x", "date": "05/10/22"}
# InputArray5 = {"UserID": 1, "accuracy": 30, "time": 1, "level": "x", "difficulty": "x", "date": "05/10/22"}
# array = [InputArray1, InputArray2, InputArray3, InputArray4, InputArray5]


#Return Json of results to be formatted


# Main Function
def getIndividualResults(jsonByteArray):
    arrayOfJsons = convertToJsonArray(jsonByteArray)
    gameResultJson = arrayOfJsons[-1]
    time = gameResultJson["timeTaken"]
    accuracy = gameResultJson["accuracy"]
    difficulty = gameResultJson["difficulty"]
    percentChanges = getPercentageChanges(time, accuracy, arrayOfJsons)
    timePercentChange = percentChanges[0]
    timeExplanation = percentChanges[1]
    accuraciesPercentChange = percentChanges[2]
    accuraciesExplanation = percentChanges[3]
    FinalJson = formatFinalJson(time, timePercentChange, timeExplanation, accuracy, accuraciesPercentChange, accuraciesExplanation, difficulty)
    print(FinalJson)
    return FinalJson


def getPercentageChanges(time, accuracy, arrayOfJsons):
    if type(time) != int or type(accuracy) != int or type(arrayOfJsons) != list:
        return {"error": "could not read data"}

    if len(arrayOfJsons) > 1:
        previousTime = arrayOfJsons[-2]["timeTaken"]
        previousAccuracy = arrayOfJsons[-2]["accuracy"]

        if previousTime > time:
            timeExplanation = "decreased"
            percentageChangeTime = round(((previousTime-time)/previousTime)*100, 0)
        else:
            timeExplanation = "increased"
            percentageChangeTime = round(((time-previousTime)/time)*100, 0)

        if previousAccuracy > accuracy:
            accuracyExplanation = "decreased"
            percentageChangeAccuracy = round((((previousAccuracy-accuracy)/previousAccuracy))*100, 0)
        else:
            accuracyExplanation = "increased"
            percentageChangeAccuracy = (((accuracy-previousAccuracy)/accuracy))*100
    else:
        percentageChangeTime = 0
        percentageChangeAccuracy = 0
        timeExplanation = "increased"
        accuracyExplanation = "increased"

    return [percentageChangeTime, timeExplanation, percentageChangeAccuracy, accuracyExplanation]


def formatFinalJson(time, timePercentChange, timeExplanation, accuracy, accuraciesPercentChange, accuracyExplanation, difficulty):
    finalJson = {"timeTaken": time, "timePercentChange": timePercentChange, "timeExplanation": timeExplanation, "accuracy": accuracy, "accuracyPercentChange": accuraciesPercentChange, "accuraciesExplanation": accuracyExplanation, "difficulty": difficulty}
    return finalJson


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
        return {"error": "could not read data"}
    return finalArray