//dependencies
import React, { useEffect, useState, useContext } from "react";
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
  Modal,
  Pressable,
} from "react-native";

//ui
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Circle } from "../components/Circle";
import { Obstacle } from "../components/Obstacle";
//import { color } from "react-native-reanimated";
import { EndingCircle } from "../components/EndingCircle";
import AntDesign from "react-native-vector-icons/AntDesign";
import themeContext from "../config/themeContext";
import Svg, { Circle as SvgCircle } from "react-native-svg";
import AppContext from "../constants/AppContext";

/**
 *
 * @author - Michal
 * The coordination part of the application, the user will have to drag a ball across the screen,
 * making sure to not hit any of the boundaries and try to do it as quickly as they can
 *
 * Difficulty levels: Difficulty starts at 1 and goes up to 7 (Adjusted with the "difficulty" state)
 * 1. Amount of obstacles increases every 20 levels
 * 2. Gap between the obstacles decreases with every level
 *
 */

export default function Game({ navigation }) {
  //tutorial pop up
  const [modalVisible, setModalVisible] = useState(true);

  const context = useContext(AppContext);

  // Retrieving an updated game difficulty
  async function GetGameDifficulty() {
    fetch("http://172.20.10.2:80/api/SwiftUserManagement/calculateDifficulty", {
      method: "POST",
      headers: {
        accept: "text/plain",
        Authorization: "Bearer " + context.JWTToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: context.userName,
        user_Id: context.userId,
      }),
    })
      .then((result) => result.json())
      .then((data) => {
        context.setDifficulty(data.newDifficulty);
      });
  }

  React.useEffect(() => {
    console.log(
      JSON.stringify({
        userName: context.userName,
        user_Id: context.userId,
      })
    );
    GetGameDifficulty();
  }, []);

  // Array for the obstacle values and where they will be rendered
  const [obstacleValues, setObstacleValues] = useState();
  const [obstacleArrayLength, setObstacleArrayLength] = useState();

  // State for the position of the final circle
  const [endingCircleXValue, setEndingCircleXValue] = useState();

  // Generates a random integer given a maximum and minimum value
  function getRandomValue(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  React.useEffect(() => {
    // Amount of rows of obstacles
    const amountOfObstacles = context.difficulty / 20;

    // The temporary array which will store the obstacle values
    const obstacleArray = [];

    // Setting the x value for the ending circle
    setEndingCircleXValue(getRandomValue(60, 320));

    // Creating an array of random Y values for the obstacles as they all have to be different
    const randomYValues = [];
    var amountOfValues = 0;
    var valueStart = 300 / amountOfObstacles - 65; // The first random YValue is calculated dependent on how many obstacles there are (This is the lower range of the random values)
    var randomValueEnd = valueStart + 35; // The upper range random value is always 35 - 40 further away
    while (amountOfValues < amountOfObstacles) {
      const randomYValue = getRandomValue(valueStart, randomValueEnd);
      const distanceForNextObstacle = 80; //400 / difficulty + 20; // The next obstacle should always be 500 / amount of obstacles
      valueStart += distanceForNextObstacle + 30; // Adding on the y value to ensure the next obstacle doesn't overlap
      randomValueEnd += distanceForNextObstacle + 30;
      randomYValues.push(randomYValue);
      amountOfValues++;
    }

    for (var i = 0; i < amountOfObstacles; i++) {
      const xObstacle2 = getRandomValue(0, 300); // Random value of how far the left obstacle goes out

      const randomXValue = getRandomValue(
        xObstacle2 + 5000 / context.difficulty,
        xObstacle2 + 8000 / context.difficulty
      ); // Random value of how far the right obstacle goes out
      //const randomXValue = 400;

      // Pushing on the first obstacle onto the array
      obstacleArray.push({
        key: i,
        xObstacle1: 0,
        xObstacle2: xObstacle2,
        yObstacle1: randomYValues[i],
        yObstacle2: randomYValues[i] + 30,
        color: "crimson",
        height: 30,
        width: xObstacle2,
      });

      // Pushing on the obstacle which will be next to this one
      obstacleArray.push({
        key: i * 100,
        xObstacle1: randomXValue,
        xObstacle2: 500,
        yObstacle1: randomYValues[i],
        yObstacle2: randomYValues[i] + 30,
        color: "crimson",
        height: 30,
        width: 350,
      });
    }

    setObstacleValues(obstacleArray);
    setObstacleArrayLength(obstacleArray.length);
  }, [context.difficulty]);

  const theme = useContext(themeContext);

  //react-native return
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {
        <View style={styles.tutorialView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalView}>
              <Image
                style={styles.logo}
                source={require("../assets/SwiftLogo2.png")}
                top={-10}
              />
              <Text style={styles.modalTitleText}>COORDINATION GAME</Text>
              <Text style={styles.modalText}>
                {"\n"}Without touching the red obstacles, move the green circle
                into the centre of the blue target as quickly as you can!
                {"\n"}
              </Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => { 
                  if(context.difficulty == 0)
                  {
                    Alert.alert("Difficulty not yet loaded!");
                  }
                  else{
                    setModalVisible(!modalVisible)
                  }  
                }}
              >
                <Text style={styles.textStyle}>Hide Tutorial</Text>
              </Pressable>
            </View>
          </Modal>
          <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.textStyle}>How to Play</Text>
          </Pressable>
        </View>
      }

      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("End Game", "Are you sure you want to end the game?", [
              {
                text: "Cancel",
                onPress: () => {
                  console.log("Action cancelled.");
                },
              },
              {
                text: "Yes, end game",
                onPress: () => {
                  navigation.goBack();
                },
              },
            ])
          }
        >
          <AntDesign name="back" size={45} color={theme.color} />
        </TouchableOpacity>
      </View>

      <Circle
        x={165}
        y={0}
        radius={30}
        color={"#74E472"}
        obstacleArray={obstacleValues}
        obstacleArrayLength={obstacleArrayLength}
        endingCircleXValue={endingCircleXValue}
        endingCircleYValue={Dimensions.get("window").height * 0.7}
        endingCircleRadius={60}
      />

      {obstacleValues
        ? obstacleValues.map((obstacle) => (
            <Obstacle
              x={obstacle.xObstacle1}
              y={obstacle.yObstacle1}
              color={obstacle.color}
              height={obstacle.height}
              width={obstacle.width}
            />
          ))
        : console.log("Creating array of values")}

      {/* <EndingCircle x={endingCircleXValue} y={550} color={"blue"} radius={120} /> */}
      <EndingCircle
        style={styles.endingCircle}
        endingCircleXValue={endingCircleXValue}
        endingCircleYValue={Dimensions.get("window").height * 0.7}
      />

      <View
        style={[
          styles.cross,
          { left: endingCircleXValue, transform: [{ rotate: "45deg" }] },
        ]}
      >
        <View style={[styles.crossUp]} />
        <View style={[styles.crossFlat]} />
      </View>
    </SafeAreaView>
  );
}

//stylesheet
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#d2f3fa",
    paddingBottom: 40,
    position: "relative",
  },
  endingCircle: {
    zIndex: -99,
    elevation: -99,
  },
  cross: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.905,
  },
  crossUp: {
    backgroundColor: "white",
    height: 20, // length of line
    width: 2, // thickness of line
  },
  crossFlat: {
    backgroundColor: "white",
    height: 2, // thickness of line
    width: 20, // length of line
    position: "absolute",
    left: -9,
    top: 9,
  },

  icons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    marginLeft: "5%",
    marginRight: "5%",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  item: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginLeft: "5%",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
    position: "absolute",
    left: 170,
  },
  logo: {
    //marginBottom: 100,
    height: 60,
    width: 80,
  },
  backButtonContainer: {
    top: -20,
    alignSelf: "flex-start",
    margin: 20,
  },
  //tutorial styles
  tutorialView: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 22,
    paddingRight: 20,
    /*
    ...Platform.select({
      ios: {
        top: -Dimensions.get("window").height * -0.05,
        alignItems: "center",
        position: "absolute",
      },
      android: {
        top: -Dimensions.get("window").height * -0.015,
        alignItems: "center",
      },
    }),
    */
  },
  modalView: {
    marginTop: 80,
    marginLeft: 15,
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 40,
    height: -Dimensions.get("window").height * -0.85,
    alignItems: "center",
    position: "absolute",
    justifyContent: "center",
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    ...Platform.select({
      ios: {
        top: -Dimensions.get("window").height * -0.005,
        height: -Dimensions.get("window").height * -0.89,
        marginTop: Dimensions.get("window").height * 0.08,
      },
      android: {
        top: -Dimensions.get("window").height * -0.005,
        height: -Dimensions.get("window").height * -0.93,
        marginTop: Dimensions.get("window").height * 0.02,
      },
    }),
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: -50,
  },
  buttonOpen: {
    backgroundColor: "#628395",
  },
  buttonClose: {
    backgroundColor: "#628395",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 25,
  },
  modalTitleText: {
    fontSize: 30,
    fontFamily: "Roboto_700Bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 25,
  },
});
