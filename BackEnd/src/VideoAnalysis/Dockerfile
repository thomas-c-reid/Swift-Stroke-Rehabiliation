# Dockerfile for the video analysis service

FROM python:3.6.6
WORKDIR /src
COPY ["VideoAnalysis/VideoAnalysisRabbitMQClient.py", "VideoAnalysis/"]
COPY ["VideoAnalysis/impairedweaknessmodel.sav", "VideoAnalysis/"]
RUN pip install --upgrade pip
RUN pip install numpy==1.19.3
RUN apt-get update && apt-get install libgl1 -y
RUN pip install opencv-python==4.5.4.58
RUN pip install Pika==1.3.0
RUN pip install protobuf==3.19.1
RUN pip install mediapipe==0.8.3
RUN pip install imageio==2.10.3
RUN pip install scikit-fuzzy==0.4.2
RUN pip install scikit-image==0.17.2
RUN pip install scipy==1.5.4
RUN pip install scikit-learn==0.24.2
VOLUME /VideoAnalysis
CMD [ "python", "-u", "VideoAnalysis/VideoAnalysisRabbitMQClient.py"]
