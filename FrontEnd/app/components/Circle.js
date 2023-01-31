import React, { Component, useState, useContext } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  View,
  Text,
  SectionList,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import "react-native-gesture-handler";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  RotateOutDownLeft,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import AppContext from "../constants/AppContext";

/**
 * @author - Michal
 * Circle class based on the work of Thomas in the Pygame game.
 * It draws, the circle, calculates boundaries and lets the user drag the circle across the screen.
 */

export function Circle(props) {
  const appContext = useContext(AppContext);
  const navigation = useNavigation();

  const state = {
    position: [props.x, props.y],
    color: props.color,
    radius: props.radius,
    endingCircleRadius: props.endingCircleRadius,
    // The boundaries are where the radius ends
    xBoundary: [props.x - props.radius, props.x + props.radius],
    yBoundary: [props.y - props.radius, props.y + props.radius],
  };

  const translateX = useSharedValue(state.position[0]);
  const translateY = useSharedValue(state.position[1]);
  const sharedObstacleHit = useSharedValue(false);
  const sharedEndingCircleHit = useSharedValue(false);
  const sharedTimeTakenStart = useSharedValue();
  const sharedTimeTakenEnd = useSharedValue();
  const sharedResult = useSharedValue(0);

  const [timeTakenState, setTimeTakenState] = React.useState();
  

  const context = useSharedValue({
    x: 0,
    y: 0,
    obstacleHit: false,
    endingCircleHit: false,
    timeTakenStart: null,
    timeTakenEnd: null,
    result: 0,
  });

  // Sending results to the back end
  async function sendResultsToBackEnd(level, timeTaken, accuracy) {
    await fetch(
      "http://172.20.10.2:80/api/SwiftUserManagement/analyseGameScore",
      {
        method: "POST",
        headers: {
          accept: "text/plain",
          Authorization: "Bearer " + appContext.JWTToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: appContext.userName,
          user_Id: appContext.userId,
          accuracy: accuracy,
          timeTaken: timeTaken,
          level: level,
          difficulty: appContext.difficulty,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        appContext.setAccuraciesExplanation(data.accuraciesExplanation);
        appContext.setAccuracy(data.accuracy);
        appContext.setAccuracyPercentChange(data.accuracyPercentChange);
        appContext.setDifficulty(data.difficulty);
        appContext.setTimeExplanation(data.timeExplanation);
        appContext.setTimePercentageChange(data.timePercentChange);
        appContext.setTimeTaken(data.timeTaken);
      });
  }

  // Function runs at the end 
  function endGame(sharedTimeTakenEnd, distanceFromCentre) {
    setTimeTakenState(sharedTimeTakenEnd);
    appContext.setDifficulty(0);
    // Sending the results needs to be changed once we know what results we want to send
    sendResultsToBackEnd(1, distanceFromCentre, sharedTimeTakenEnd);
    navigation.navigate("CoordinationResult");
  }

  // On start, it sets all of the necessary values to their initial states
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = {
        x: 165,
        y: 0,
        obstacleHit: sharedObstacleHit.value,
        endingCircleHit: sharedEndingCircleHit.value,
      };
      sharedEndingCircleHit.value = false;
      sharedObstacleHit.value = false;
      sharedResult.value = 0;
      sharedTimeTakenStart.value = Date.now();
    })

    // Updates all the values in the circle every time it is dragged a pixel across the screen
    .onUpdate((event) => {

      // Moving the circle
      if (sharedObstacleHit.value == false) {
        translateX.value = event.translationX + context.value.x;
        translateY.value = event.translationY + context.value.y;
      }

      // Collision on an obstacle
      for (var i = 0; i < props.obstacleArrayLength; i++) {
        if (
          props.obstacleArray[i].xObstacle1 <= translateX.value &&
          translateX.value <= props.obstacleArray[i].xObstacle2 &&
          props.obstacleArray[i].yObstacle1 <= translateY.value &&
          translateY.value <= props.obstacleArray[i].yObstacle2
        ) {
          sharedObstacleHit.value = true;
          translateX.value = state.position[0];
          translateY.value = state.position[1];
        }
      }
      if (
        props.endingCircleXValue - 60 <= translateX.value &&
        translateX.value + 30 <= props.endingCircleXValue + 60 &&
        props.endingCircleYValue - 60 <= translateY.value - 30 &&
        translateY.value <= props.endingCircleYValue + 60
      ) {
        sharedEndingCircleHit.value = true;

        // Calculating distance from centre of ending circle (hypotenuse)
        // translateX + 15 to get from far left to centre of moving circle
        const xFromCentre = Math.abs(
          (translateX.value + 15) - props.endingCircleXValue
        );
        // translateY - 15 to get from bottom to centre of moving circle
        const yFromCentre = Math.abs(
          (translateY.value - 15) - props.endingCircleYValue
        );
        const distanceFromCentre = Math.sqrt(
          Math.pow(xFromCentre, 2) + Math.pow(yFromCentre, 2)
        );

        // if placed right on edge of ending circle, score is 1
        if (distanceFromCentre === props.endingCircleRadius) {
          sharedResult.value = 1;
        } else {
          // to calculate score with 100 as centre of ending circle and decreasing further away from centre
          // multiplying by 5/3 as max distance from centre is 60 (60*(5/3)=100)
          const result = Math.abs(distanceFromCentre - 60) * (5/3);
          sharedResult.value = result;
        }
      } else {
        sharedEndingCircleHit.value = false;
        sharedResult.value = 0;
      }
    })

    // Once the user lets go of the circle, this callback is called
    .onEnd(() => {
      if (sharedEndingCircleHit.value) {
        sharedTimeTakenEnd.value = Date.now();
        sharedTimeTakenEnd.value = Math.floor((sharedTimeTakenEnd.value - sharedTimeTakenStart.value) / 1000);
        sharedResult.value = Math.floor(sharedResult.value);
        runOnJS(endGame)(sharedTimeTakenEnd.value, sharedResult.value);
      } else {
        translateX.value = state.position[0];
        translateY.value = state.position[1];
      }
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  // React-native return
  return (
    <>
      <View style={styles.container}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles(state).circle, rStyle]}>
          </Animated.View>
        </GestureDetector>
      </View>
    </>
  );
}

const styles = (props) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    circle: {
      backgroundColor: props.color,
      height: props.radius,
      aspectRatio: 1,
      borderRadius: props.radius,
    },
  });
