import getAccuracyHistoric
import datetime

# TESTING ISIN() ================================================================================
date1 = "01/01"
date2 = "02/01"
date3 = "03/01"
date4 = "04/01"
dateArray = [date1, date2, date3]

# TESTING CONVERTSTRINGTODATE() ================================================================
actualDate1 = datetime.datetime(year=2001, month=1, day=1)
dateTemp = "01/01/2001"

# # TESTING CONSTRUCTJSONHISTORIC() ========================================================
average = 5
actualDate2 = datetime.datetime(year=2001, month=1, day=1)
dateFormatted = "01/01/2001"
json1 = {"date": dateFormatted, "average": average}
json2 = {"date": dateFormatted, "average": (average+1)}

# TESTING GENERAL ========================================================================
byteArray = b'[{"User_Id":1,"accuracy":45,"timeTaken":50,"level":1,"explanation":"No stroke symptoms","difficulty":90,"DateAddedToDb":"11/19/2022 14:06:33"},{"User_Id":1,"accuracy":27,"timeTaken":23,"level":0,"explanation":"No stroke symptoms","difficulty":100,"DateAddedToDb":"11/18/2022 14:06:33"},{"User_Id":1,"accuracy":52,"timeTaken":36,"level":0,"explanation":"No stroke symptoms","difficulty":70,"DateAddedToDb":"11/16/2022 14:06:33"}]'
json3 = {"User_Id":1,"accuracy":45,"timeTaken":50,"level":1,"explanation":"No stroke symptoms","difficulty":90,"DateAddedToDb":"11/19/2022 14:06:33"}
json4 = {"User_Id":1,"accuracy":27,"timeTaken":23,"level":0,"explanation":"No stroke symptoms","difficulty":100,"DateAddedToDb":"11/18/2022 14:06:33"}
json5 = {"User_Id":1,"accuracy":52,"timeTaken":36,"level":0,"explanation":"No stroke symptoms","difficulty":70,"DateAddedToDb":"11/16/2022 14:06:33"}
jsonArray = [json3, json4, json5]
finalJsonStructure = [{'date': '16/11/2022', 'average': 52}, {'date': '18/11/2022', 'average': 27}, {'date': '19/11/2022', 'average': 45}]
emptyJson = []
now = datetime.datetime.now


def test_isIn():
    assert getAccuracyHistoric.isIn(date1, dateArray) == True
    assert getAccuracyHistoric.isIn(date4, dateArray) == False
    assert getAccuracyHistoric.isIn("hello", dateArray) == False

def test_convertToJsonArray():
    assert getAccuracyHistoric.convertToJsonArray(byteArray) == jsonArray
    assert getAccuracyHistoric.convertToJsonArray(finalJsonStructure) == emptyJson

def test_convertStringToDate():
    # right tests
    assert getAccuracyHistoric.convertStringToDate(dateTemp) == actualDate1
    # Wrong Tests
    assert getAccuracyHistoric.convertStringToDate("hello") == now
    assert getAccuracyHistoric.convertStringToDate("21/46/3033") == now
    assert getAccuracyHistoric.convertStringToDate(6) == now

def test_constructJsonHistoric():
    assert getAccuracyHistoric.constructJsonHistoric(actualDate2, average) == json1
    assert getAccuracyHistoric.constructJsonHistoric(actualDate2, average) != json2

def test_getAccuracyHistoric():
    assert getAccuracyHistoric.getAccuracyHistoric(byteArray) == finalJsonStructure
    assert getAccuracyHistoric.getAccuracyHistoric(finalJsonStructure) == emptyJson