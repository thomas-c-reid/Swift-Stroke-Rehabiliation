import React, { Component, useState } from "react";
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
import Svg, { Circle as SvgCircle } from "react-native-svg";

/**
 * @author - Michal
 * Ending Circle class based on the work of Thomas in the Pygame game.
 * This is the circle that you need to get into at the end of the game.
 */

export function EndingCircle(props) {
  // React-native return
  return (
    <>
      <View>
        {
          <Svg>
            <SvgCircle
              cx={props.endingCircleXValue}
              cy={props.endingCircleYValue}
              r={60}
              fill="blue"
              opacity={0.5}
            />
          </Svg>
        }
      </View>
    </>
  );
}

const styles = (props) =>
  StyleSheet.create({
    circle: {
      backgroundColor: props.color,
      position: "absolute",
      top: props.y,
      left: props.x,
      width: props.radius,
      height: props.radius,
      aspectRatio: 1,
      borderRadius: props.radius,
    },
  });
