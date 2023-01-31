import getTimeHistoric
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

# TESTING CONSTRUCTJSONHISTORIC() ========================================================
average = 5
actualDate2 = datetime.datetime(year=2001, month=1, day=1)
dateFormatted = "01/01/2001"
json1 = {"date": dateFormatted, "average": average}
json2 = {"date": dateFormatted, "average": (average+1)}

# TESTING GENERAL ==============================================================================
byteArray = b'[{"User_Id":1,"accuracy":45,"timeTaken":50,"level":1,"explanation":"No stroke symptoms","difficulty":90,"DateAddedToDb":"11/19/2022 14:06:33"},{"User_Id":1,"accuracy":27,"timeTaken":23,"level":0,"explanation":"No stroke symptoms","difficulty":100,"DateAddedToDb":"11/18/2022 14:06:33"},{"User_Id":1,"accuracy":52,"timeTaken":36,"level":0,"explanation":"No stroke symptoms","difficulty":70,"DateAddedToDb":"11/16/2022 14:06:33"}]'
json3 = {"User_Id":1,"accuracy":45,"timeTaken":50,"level":1,"explanation":"No stroke symptoms","difficulty":90,"DateAddedToDb":"11/19/2022 14:06:33"}
json4 = {"User_Id":1,"accuracy":27,"timeTaken":23,"level":0,"explanation":"No stroke symptoms","difficulty":100,"DateAddedToDb":"11/18/2022 14:06:33"}
json5 = {"User_Id":1,"accuracy":52,"timeTaken":36,"level":0,"explanation":"No stroke symptoms","difficulty":70,"DateAddedToDb":"11/16/2022 14:06:33"}
jsonArray = [json3, json4, json5]
emptyJson = []
finalJsonStructure = [{'date': '16/11/2022', 'average': 36}, {'date': '18/11/2022', 'average': 23}, {'date': '19/11/2022', 'average': 50}]
now = datetime.datetime.now


def test_isIn():
    assert getTimeHistoric.isIn(date1, dateArray) == True
    assert getTimeHistoric.isIn(date4, dateArray) == False
    assert getTimeHistoric.isIn("hello", dateArray) == False

def test_convertStringToDate():
    # Right Test
    assert getTimeHistoric.convertStringToDate(dateTemp) == actualDate1
    # Wrong Tests
    assert getTimeHistoric.convertStringToDate("hello") == now
    assert getTimeHistoric.convertStringToDate("21/46/3033") == now
    assert getTimeHistoric.convertStringToDate(6) == now

def test_constructJsonHistoric():
    # Need more tests but syntactically correct
    assert getTimeHistoric.constructJsonHistoric(actualDate2, average) == json1
    assert getTimeHistoric.constructJsonHistoric(actualDate2, average) != json2

def test_convertToJsonArray():
    assert getTimeHistoric.convertToJsonArray(byteArray) == jsonArray
    assert getTimeHistoric.convertToJsonArray(finalJsonStructure) == emptyJson

def test_getTimeHistoric():
    assert getTimeHistoric.getTimeHistoric(byteArray) == finalJsonStructure
    assert getTimeHistoric.getTimeHistoric(finalJsonStructure) == emptyJson
