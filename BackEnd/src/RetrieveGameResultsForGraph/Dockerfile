# Dockerfile for the retrieve game results for graph service

FROM python:3.9
WORKDIR /src
COPY ["RetrieveGameResultsForGraph/RetrieveGameResultsForGraphRabbitMQClient.py", "RetrieveGameResultsForGraph/"]
COPY ["RetrieveGameResultsForGraph/getRadarData.py", "RetrieveGameResultsForGraph/"]
COPY ["RetrieveGameResultsForGraph/getTimeHistoric.py", "RetrieveGameResultsForGraph/"]
COPY ["RetrieveGameResultsForGraph/getAccuracyHistoric.py", "RetrieveGameResultsForGraph/"]
COPY ["RetrieveGameResultsForGraph/getResults.py", "RetrieveGameResultsForGraph/"]
COPY ["RetrieveGameResultsForGraph/gameScores.py", "RetrieveGameResultsForGraph/"]



RUN pip install pika
RUN pip install marshmallow
CMD [ "python", "-u", "RetrieveGameResultsForGraph/RetrieveGameResultsForGraphRabbitMQClient.py"]
