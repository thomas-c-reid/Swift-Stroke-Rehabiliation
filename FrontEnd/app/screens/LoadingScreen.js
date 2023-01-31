import React, { useContext, useRef, useEffect, useState } from "react";
import themeContext from "../config/themeContext";
import {
  Image,
  ImageBackground,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  SafeAreaView,
  Linking,
  Dimensions,
  Alert,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

// Loading screen for the app, NOT CURRENTLY USED

function LoadingScreen({ navigation }) {
  const theme = useContext(themeContext);

  const showButton = () => {
    navigation.navigate("CoordinationScreen");
  };

  return (
    <SafeAreaView
      style={[styles.background, { backgroundColor: theme.background }]}
    >
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/SwiftLogo2.png")}
        />
        <Text style={[styles.titleText, { color: theme.color }]}>
          LOADING...
          {"\n"}
        </Text>
      </View>

      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="back" size={45} color={theme.color} />
        </TouchableOpacity>
      </View>

      <View style={styles.tutorialBox}>
        <Text style={[styles.subtitleText, { color: theme.color }]}>
          {"\n"}Without touching the red obstacles, move the black ball into the
          centre of the blue endpoint as quickly as you can!
          {"\n"}
        </Text>
      </View>

      <View style={styles.button}>
        <TouchableOpacity
          onPress={() => {
            showButton();
          }}
        >
          <Text style={[styles.buttonText, { color: theme.color }]}>
            LET'S PLAY
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#CCF2F4",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  logoContainer: {
    alignItems: "center",
    position: "absolute",
    ...Platform.select({
      ios: {
        top: -Dimensions.get("window").height * -0.08,
        alignItems: "center",
        position: "absolute",
      },
      android: {
        top: -Dimensions.get("window").height * -0.03,
        alignItems: "center",
      },
    }),
  },
  tutorialBox: {
    alignItems: "center",
    width: 400,
    height: -50,
    justifyContent: "space-evenly",
    position: "absolute",
    paddingTop: 10,
    ...Platform.select({
      ios: {
        top: -Dimensions.get("window").height * -0.3,
      },
      android: {
        top: -Dimensions.get("window").height * -0.26,
      },
    }),
  },
  button: {
    backgroundColor: "#8BBCCC",
    width: 360,
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "center",
    ...Platform.select({
      ios: {
        top: -Dimensions.get("window").height * -0.3,
      },
      android: {
        top: -Dimensions.get("window").height * -0.3,
      },
    }),
  },
  button2: {
    backgroundColor: "#8BBCCC",
    width: 360,
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "center",
    ...Platform.select({
      ios: {
        top: -Dimensions.get("window").height * -0.5,
      },
      android: {
        top: -Dimensions.get("window").height * -0.3,
      },
    }),
  },
  logo: {
    width: 100,
    height: 100,
  },
  backButtonContainer: {
    alignItems: "flex-start",
    alignSelf: "flex-start",
    margin: 30,
    paddingTop: Platform.OS === "android" ? 20 : 0,
    ...Platform.select({
      ios: {
        top: -Dimensions.get("window").height * 0.37,
      },
      android: {
        top: -Dimensions.get("window").height * 0.42,
      },
    }),
  },
  //text styles
  titleText: {
    fontFamily: "YesevaOne_400Regular",
    fontSize: 45,
    color: "black",
  },
  subtitleText: {
    fontFamily: "Roboto_300Light_Italic",
    fontSize: 40,
    textAlign: "center",
  },
  buttonText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 25,
    textAlign: "center",
  },
});

export default LoadingScreen;
