import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Text } from "react-native";

/**
 * @author - Michal
 * Obstacle class based on the work of Thomas in th Pygame game
 */

export function Obstacle(props) {
  const state = {
    xCoord: props.x,
    yCoord: props.y,
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles(props).rectangle}></View>
      </View>
    </>
  );
}

const styles = (props) =>
  StyleSheet.create({
    container: {
      flex: 1,      
    },
    rectangle: {
      position: "absolute",
      left: props.x,
      top: props.y,
      backgroundColor: props.color,
      height: props.height,
      width: props.width,
    },
  });
