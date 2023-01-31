import getRadarData
import getAccuracyHistoric
import getTimeHistoric
from datetime import timedelta, datetime

today = datetime.today()
weekAgo = today - timedelta(days=6)
weekPlusOne = weekAgo + timedelta(days=1)
weekMinusOne = weekAgo - timedelta(days=1)


def getResultsJson(jsonArray):
    if isinstance(jsonArray, bytes):
        radarResults = getRadarData.getRadarData(jsonArray)
        accuracyHistoricResults = getAccuracyHistoric.getAccuracyHistoric(jsonArray)
        timeHistoricResults = getTimeHistoric.getTimeHistoric(jsonArray)
        finalJson = constructFinalJson(radarResults, accuracyHistoricResults, timeHistoricResults)
        print(finalJson)
    else:
        finalJson = {"error": "Could not parse data"}
    return finalJson


def constructFinalJson(radarResults, accuracyHistoricResults, timeHistoricResults):
    json = {"radarResults": radarResults, "accuracyHistoricResults": accuracyHistoricResults,
            "timeHistoricResults": timeHistoricResults}
    return json