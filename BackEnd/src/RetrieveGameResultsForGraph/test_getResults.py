import getResults

# TESTING constructFinalJson()
radarResults = {"engagement": 2, "time": 2, "accuracy": 45}
accuracyHistoricResults1 = {"date": "12/11/2022", "average": 30}
accuracyHistoricResults2 = {"date": "13/11/2022", "average": 60}
accuracyHistoricResults = [accuracyHistoricResults1, accuracyHistoricResults2]
timeHistoricResults = {"date": "12/11/2022", "average": 2}
timeHistoricResults = {"date": "13/11/2022", "average": 2}
json1 = {"radarResults": radarResults, "accuracyHistoricResults": accuracyHistoricResults, "timeHistoricResults": timeHistoricResults}


# TESTING getResultsJson()
json2 = {"UserID": 1, "accuracy": 30, "time": 2, "level": "x", "difficulty": "x", "date": "12/11/2022"}
json3 = {"UserID": 1, "accuracy": 60, "time": 2, "level": "x", "difficulty": "x", "date": "13/11/2022"}
jsonArray = [json2, json3]

#TESTING GETRESULTS() =============================================================================
byteArray1 = b'[{"User_Id":1,"accuracy":45,"timeTaken":50,"level":1,"explanation":"No stroke symptoms","difficulty":90,"DateAddedToDb":"11/19/2022 14:06:33"},{"User_Id":1,"accuracy":27,"timeTaken":23,"level":0,"explanation":"No stroke symptoms","difficulty":100,"DateAddedToDb":"11/18/2022 14:06:33"},{"User_Id":1,"accuracy":51,"timeTaken":35,"level":0,"explanation":"No stroke symptoms","difficulty":70,"DateAddedToDb":"11/16/2022 14:06:33"}]'
finalArray = {'radarResults': {'engagement': 1, 'time': 50.0, 'accuracy': 45.0, 'difficulty': 90.0}, 'accuracyHistoricResults': [{'date': '16/11/2022', 'average': 51}, {'date': '18/11/2022', 'average': 27}, {'date': '19/11/2022', 'average': 45}], 'timeHistoricResults': [{'date': '16/11/2022', 'average': 35}, {'date': '18/11/2022', 'average': 23}, {'date': '19/11/2022', 'average': 50}]}
finalJson = {"error": "Could not parse data"}


def test_constructFinalJson():
    assert getResults.constructFinalJson(radarResults, accuracyHistoricResults, timeHistoricResults) == json1
    assert getResults.constructFinalJson(radarResults, accuracyHistoricResults, timeHistoricResults) != json2


def test_getResultsJson():
    assert getResults.getResultsJson(byteArray1) == finalArray
    assert getResults.getResultsJson(jsonArray) == finalJson


