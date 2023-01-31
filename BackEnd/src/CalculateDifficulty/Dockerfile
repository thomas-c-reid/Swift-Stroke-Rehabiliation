# Dockerfile used to containerise the CalculateDifficulty service

FROM python:3.9
WORKDIR /src
COPY ["CalculateDifficulty/CalculateDifficultyRabbitMQClient.py", "CalculateDifficulty/"]
COPY ["CalculateDifficulty/difficultyCalculator.py", "CalculateDifficulty/"]
RUN pip install pika
CMD [ "python", "-u", "CalculateDifficulty/CalculateDifficultyRabbitMQClient.py"]
