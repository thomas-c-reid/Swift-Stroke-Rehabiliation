import statistics
import json
import getIndividualGameResult

InputGameResults = {"UserID": 1, "accuracy": 30, "time": 1, "level": "x", "difficulty": "x", "date": "05/10/22"}

# TESTING getPercentageChanges() ===================================================
json1 = {"UserID": 1, "accuracy": 30, "timeTaken": 1, "level": "x", "difficulty": "x", "dateAddedToDb": "05/10/22"}
json2 = {"UserID": 1, "accuracy": 30, "timeTaken": 1, "level": "x", "difficulty": "x", "dateAddedToDb": "05/10/22"}
jsonArray1 = [json1, json2]
jsonArray2 = []
time1 = 1
accuracy1 = 30
finalArray1 = [0.0, "increased", 0.0, "increased"]
finalArray2 = [0.0, "increased", 0.0, "increased"]

# TESTING formatFinalJson() ==================================================================
time2 = 0
timePercentChange = 0
timeExplanation = "increased"
accuracy2 = 0
accuraciesPercentChange = 0 
accuracyExplanation = "increased"
difficulty = 50
json3 = {"timeTaken": time2, "timePercentChange": timePercentChange, "timeExplanation": timeExplanation, "accuracy": accuracy2, "accuracyPercentChange": accuraciesPercentChange, "accuraciesExplanation": accuracyExplanation, "difficulty": difficulty}

# TESTING GETINDIVIDUALRESULTS() ================================================================================
byteArray1 = b'[{"User_Id":1,"accuracy":45,"timeTaken":50,"level":1,"explanation":"No stroke symptoms","difficulty":90,"DateAddedToDb":"11/19/2022 16:19:21"},{"User_Id":1,"accuracy":27,"timeTaken":23,"level":0,"explanation":"No stroke symptoms","difficulty":100,"DateAddedToDb":"11/18/2022 16:19:21"},{"User_Id":1,"accuracy":52,"timeTaken":36,"level":0,"explanation":"No stroke symptoms","difficulty":70,"DateAddedToDb":"11/16/2022 16:19:21"}]'
json4 = {"User_Id":1,"accuracy":45,"timeTaken":50,"level":1,"explanation":"No stroke symptoms","difficulty":90,"DateAddedToDb":"11/19/2022 16:19:21"}
json5 = {"User_Id":1,"accuracy":27,"timeTaken":23,"level":0,"explanation":"No stroke symptoms","difficulty":100,"DateAddedToDb":"11/18/2022 16:19:21"}
json6 = {"User_Id":1,"accuracy":52,"timeTaken":36,"level":0,"explanation":"No stroke symptoms","difficulty":70,"DateAddedToDb":"11/16/2022 16:19:21"}
jsonArray3 = [json4, json5, json6]
finalArray3 = {'timeTaken': 36, 'timePercentChange': 36, 'timeExplanation': 'increased', 'accuracy': 52, 'accuracyPercentChange': 48.07692307692308, 'accuraciesExplanation': 'increased', 'difficulty': 70}
errorJson1 = {"error": "could not read data"}
finalJson = {"timeTaken": 5, "timePercentChange": 5, "timeExplanation": "increased", "accuracy": 5, "accuracyPercentChange": 5, "accuraciesExplanation": "decreased", "difficulty": 50}

def test_getPercentageChanges():
    assert getIndividualGameResult.getPercentageChanges(time1, accuracy1, jsonArray2) == finalArray1
    assert getIndividualGameResult.getPercentageChanges(time1, accuracy1, jsonArray1) == finalArray1
    assert getIndividualGameResult.getPercentageChanges(5, "hi", jsonArray1) == errorJson1
    assert getIndividualGameResult.getPercentageChanges("hi", 5, jsonArray1) == errorJson1
    assert getIndividualGameResult.getPercentageChanges(5, 5, "hi") == errorJson1



def test_formatFinalJson():
    assert getIndividualGameResult.formatFinalJson(5,5,"increased",5,5,"decreased",50) == finalJson
    assert getIndividualGameResult.formatFinalJson(5,5,"increased",5,5,"decreased",50) != finalArray1


def test_convertToJsonArray():
    assert getIndividualGameResult.convertToJsonArray(byteArray1) == jsonArray3
    assert getIndividualGameResult.convertToJsonArray(jsonArray1) == errorJson1

def test_getIndividualResults():
    assert getIndividualGameResult.getIndividualResults(byteArray1) == finalArray3