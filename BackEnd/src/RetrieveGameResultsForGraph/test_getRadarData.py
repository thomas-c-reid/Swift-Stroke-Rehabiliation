from datetime import timedelta, datetime
import getRadarData


# GENERAL TESTING =======================================================================================
today = datetime.today()
tempDate = datetime(year=int(2022), month=int(3), day=int(11))
weekAgo = today - timedelta(days=6)
weekPlusOne = weekAgo + timedelta(days=1)
weekMinusOne = weekAgo - timedelta(days=1)

json1 = {"UserID": 1, "accuracy": 30, "timeTaken": 1, "level": 5, "difficulty": 5, "DateAddedToDb": "03/11/2022"}
json2 = {"UserID": 1, "accuracy": 60, "timeTaken": 2, "level": 5, "difficulty": 5, "DateAddedToDb": "11/11/2022"}
json3 = {"UserID": 1, "accuracy": 90, "timeTaken": 3, "level": 5, "difficulty": 5, "DateAddedToDb": "11/16/2022"}
json4 = {"UserID": 1, "accuracy": 60, "timeTaken": 4, "level": 5, "difficulty": 5, "DateAddedToDb": "11/17/2022"}
json5 = {"UserID": 1, "accuracy": 60, "timeTaken": 5, "level": 5, "difficulty": 5, "DateAddedToDb": "11/18/2022"}
json6 = {"UserID": 1, "accuracy": 70, "timeTaken": 5, "level": 5, "difficulty": 5, "DateAddedToDb": "11/19/2022"}

jsonArray = [json1, json2, json3, json4, json5, json6]
emptyArray = []


# TESTING ISIN() ================================================================================
date1 = "01/01"
date2 = "02/01"
date3 = "03/01"
date4 = "04/01"
dateArray1 = [date1, date2, date3]

# TESTING removeDuplicateDates() ================================================================
dateArray2 = [today, today, weekPlusOne, weekPlusOne]
dateArray3 = [weekPlusOne, today]

# TESTING 
json7 ={"engagement": 5, "time": 6, "accuracy": 7, "difficulty": 8}
now = datetime.now
byteArray = b'[{"User_Id":1,"accuracy":45,"timeTaken":50,"level":1,"explanation":"No stroke symptoms","difficulty":90,"DateAddedToDb":"11/19/2022 14:06:33"},{"User_Id":1,"accuracy":27,"timeTaken":23,"level":0,"explanation":"No stroke symptoms","difficulty":100,"DateAddedToDb":"11/18/2022 14:06:33"},{"User_Id":1,"accuracy":52,"timeTaken":36,"level":0,"explanation":"No stroke symptoms","difficulty":70,"DateAddedToDb":"11/16/2022 14:06:33"}]'
json3 = {"User_Id":1,"accuracy":45,"timeTaken":50,"level":1,"explanation":"No stroke symptoms","difficulty":90,"DateAddedToDb":"11/19/2022 14:06:33"}
json4 = {"User_Id":1,"accuracy":27,"timeTaken":23,"level":0,"explanation":"No stroke symptoms","difficulty":100,"DateAddedToDb":"11/18/2022 14:06:33"}
json5 = {"User_Id":1,"accuracy":52,"timeTaken":36,"level":0,"explanation":"No stroke symptoms","difficulty":70,"DateAddedToDb":"11/16/2022 14:06:33"}
jsonArray2 = [json3, json4, json5]
json8 ={"engagement": 1, "time": 50, "accuracy": 45, "difficulty": 90}
emptyJson = {"engagement": 0, "time": 0, "accuracy": 0, "difficulty": 0}


# TODO - Test with null values etc
# TODO - fix around so you only call three functions, getRadarData, getAccuracyHistoric, getTimeHistoric
# TODO - Make data input functions, saveGameResults - text guzy before

# Getting Each of the individual results ------------------------------------------
def test_isIn():
    assert getRadarData.isIn(date1, dateArray1) == True
    assert getRadarData.isIn(date4, dateArray1) == False
    assert getRadarData.isIn("hello", dateArray1) == False


def test_returnAvgAccuracy():
    assert getRadarData.returnAvgAccuracy(jsonArray) == 70
    assert getRadarData.returnAvgAccuracy(jsonArray) != 424
    assert getRadarData.returnAvgAccuracy(emptyArray) == 0
    assert getRadarData.returnAvgAccuracy(dateArray1) == 0


def test_returnAvgDifficulty():
    assert getRadarData.returnAvgDifficulty(jsonArray) == 5
    assert getRadarData.returnAvgDifficulty(jsonArray) != 4
    assert getRadarData.returnAvgDifficulty(emptyArray) == 0
    assert getRadarData.returnAvgDifficulty(dateArray1) == 0


def test_convertStringToDate():
    assert getRadarData.convertStringToDate(json1) == tempDate
    assert getRadarData.convertStringToDate(json1) != date1
    assert getRadarData.convertStringToDate(emptyArray) == -1


def test_returnAvgTime():
    assert getRadarData.returnAvgTime(jsonArray) == 5
    assert getRadarData.returnAvgTime(jsonArray) != 4
    assert getRadarData.returnAvgTime(emptyArray) == 0
    assert getRadarData.returnAvgTime(dateArray1) == 0


def test_returnEngagement():
    assert getRadarData.returnEngagement(jsonArray) == 1
    assert getRadarData.returnEngagement(jsonArray) != 3
    assert getRadarData.returnEngagement(emptyArray) == 0
    assert getRadarData.returnEngagement(dateArray1) == 0
    

def test_removeDuplicateDates():
    assert getRadarData.removeDuplicateDates(dateArray2) == dateArray3
    assert getRadarData.removeDuplicateDates(emptyArray) == emptyArray


def test_constructJsonRadar():
    assert getRadarData.constructJsonRadar(6,7,5,8) == json7
    assert getRadarData.constructJsonRadar(3,4,5,8) != json7


def test_convertToJsonArray():
    assert getRadarData.convertToJsonArray(byteArray) == jsonArray2
    assert getRadarData.convertToJsonArray(dateArray1) == emptyArray


def test_getRadarData():
    assert getRadarData.getRadarData(byteArray) == json8
    assert getRadarData.getRadarData(jsonArray) == emptyJson