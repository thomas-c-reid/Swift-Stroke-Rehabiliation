# Dockerfile used to containerise the GameAnalysis service

FROM python:3.9
WORKDIR /src
COPY ["GameAnalysis/GameAnalysisRabbitMQClient.py", "GameAnalysis/"]
COPY ["GameAnalysis/getIndividualGameResult.py", "GameAnalysis/"]
RUN pip install pika
CMD [ "python", "-u", "GameAnalysis/GameAnalysisRabbitMQClient.py"]

