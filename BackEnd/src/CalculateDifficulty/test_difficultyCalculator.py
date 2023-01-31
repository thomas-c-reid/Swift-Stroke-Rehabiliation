import difficultyCalculator

threshold = 80

# TESTING VARIABLES =========================================================
byteArray1 = b'[{"User_Id":1,"accuracy":45,"timeTaken":50,"level":1,"explanation":"No stroke symptoms","difficulty":90,"DateAddedToDb":"11/19/2022 16:19:21"},{"User_Id":1,"accuracy":27,"timeTaken":23,"level":0,"explanation":"No stroke symptoms","difficulty":100,"DateAddedToDb":"11/18/2022 16:19:21"},{"User_Id":1,"accuracy":52,"timeTaken":36,"level":0,"explanation":"No stroke symptoms","difficulty":70,"DateAddedToDb":"11/16/2022 16:19:21"}]'
json1 = {"User_Id":1,"accuracy":45,"timeTaken":50,"level":1,"explanation":"No stroke symptoms","difficulty":90,"DateAddedToDb":"11/19/2022 16:19:21"}
json2 = {"User_Id":1,"accuracy":27,"timeTaken":23,"level":0,"explanation":"No stroke symptoms","difficulty":100,"DateAddedToDb":"11/18/2022 16:19:21"}
json3 = {"User_Id":1,"accuracy":52,"timeTaken":36,"level":0,"explanation":"No stroke symptoms","difficulty":70,"DateAddedToDb":"11/16/2022 16:19:21"}
jsonArray1 = [json1, json2, json3]
finalArray = {"newDifficulty": 71}
errorJson1 = {"Error": "could not retrieve data"}
errorJson2 = {"error": "could not read last game data"}
errorJson3 = {"error": "could not read data"}

def test_calculateDifficulty():
    assert difficultyCalculator.calculateDifficulty(100,50) == 55
    assert difficultyCalculator.calculateDifficulty(89,50) == 54
    assert difficultyCalculator.calculateDifficulty(79,50) == 53
    assert difficultyCalculator.calculateDifficulty(69,50) == 52
    assert difficultyCalculator.calculateDifficulty(59,50) == 51
    assert difficultyCalculator.calculateDifficulty(50,50) == 50
    assert difficultyCalculator.calculateDifficulty(49,50) == 49
    assert difficultyCalculator.calculateDifficulty(39,50) == 48
    assert difficultyCalculator.calculateDifficulty(29,50) == 47
    assert difficultyCalculator.calculateDifficulty(19,50) == 46
    assert difficultyCalculator.calculateDifficulty(9,50) == 45
    assert difficultyCalculator.calculateDifficulty(0,0) == 0
    assert difficultyCalculator.calculateDifficulty(100,100) == 100
    assert difficultyCalculator.calculateDifficulty("hi", 50) == errorJson2
    assert difficultyCalculator.calculateDifficulty(50, "hi") == errorJson2
    assert difficultyCalculator.calculateDifficulty("hi", "hi") == errorJson2



def test_convertToJsonArray():
    assert difficultyCalculator.convertToJsonArray(byteArray1) == jsonArray1
    assert difficultyCalculator.convertToJsonArray(jsonArray1) == errorJson3
    
def test_getNewGameDifficulty():
    assert difficultyCalculator.getNewGameDifficulty(byteArray1) == finalArray
    assert difficultyCalculator.getNewGameDifficulty(jsonArray1) == errorJson1
