import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  SafeAreaView,
} from "react-native";
import AppContext from "../constants/AppContext";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import theme from "../config/theme";
import themeContext from "../config/themeContext";
import AntDesign from "react-native-vector-icons/AntDesign";
import { color } from "react-native-reanimated";

// The view results screen retrieves the users results from the back end, and allows the user to choose if they would like to see their results over time or on a radar chart

function App({ navigation }) {
  const context = useContext(AppContext);
  const theme = useContext(themeContext);

  function retrieveGameResultsFromBackEnd() {
    fetch("http://172.20.10.2:80/api/SwiftUserManagement/retrieveGameResults", {
      method: "POST",
      headers: {
        accept: "text/plain",
        Authorization: "Bearer " + context.JWTToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserName: context.userName,
        User_Id: context.userId,
        AmountOfDataResults: 2,
      }),
    })
      .then((result) => result.json())
      .then((data) => {
        var tempArrayAccuracy = [];
        for (var i = 0; i < data.accuracyHistoricResults.length; i++) {
          const accuracyResults = {
            x: data.accuracyHistoricResults[i].date,
            y: data.accuracyHistoricResults[i].average,
          };
          tempArrayAccuracy.push(accuracyResults);
        }
        context.setAccuracyGraphResults(tempArrayAccuracy);

        var tempArrayTime = [];
        for (var i = 0; i < data.timeHistoricResults.length; i++) {
          const timeResults = {
            x: data.timeHistoricResults[i].date,
            y: data.timeHistoricResults[i].average,
          };
          tempArrayTime.push(timeResults);
        }
        context.setTimeGraphResults(tempArrayTime);

        var tempArrayRadar = [
          {
            engagement: data.radarResults.engagement,
            time: data.radarResults.time,
            accuracy: data.radarResults.accuracy,
            difficulty: data.radarResults.difficulty,
          },
          {
            engagement: 7,
            time: 5,
            accuracy: 100,
            difficulty: 100,
          }
        ];
        context.setRadarGraphResults(tempArrayRadar);
      });
  }

  // Retrieving the values needed for the graphs
  React.useEffect(() => {
    retrieveGameResultsFromBackEnd();
  }, []);

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
          VIEW RESULTS
        </Text>
      </View>

      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="back" size={45} color={theme.color} />
        </TouchableOpacity>
      </View>

      <View style={styles.containerExplain}>
        <Text style={[styles.explainText, { color: theme.color}]}>
          Select to view your weekly average:
        </Text>
      </View>

      <View style={styles.Container1}>
        <TouchableOpacity
          onPress={() => navigation.navigate("RadarResultScreen")}
        >
          <View style={styles.top}>
            <Text style={styles.regularText}>Weekly Progress</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={[styles.containerExplain, { top: -20 }]}>
        <Text style={[styles.explainText, { color: theme.color}]}>
          Select to view your daily average:
        </Text>
      </View>

      <View style={styles.Container2}>
        <TouchableOpacity
          onPress={() => navigation.navigate("LineResultScreen")}
        >
          <View style={styles.top}>
            <Text style={styles.regularText}>Daily Progress</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#CCF2F4",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? 50 : 0,
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
  top: {
    flex: 0.3,
    backgroundColor: "#8BBCCC",
    width: 360,
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "center",
  },
  //containers
  logoContainer: {
    alignItems: "center",
    position: "absolute",
    ...Platform.select({
      ios: {
        top: -Dimensions.get("window").height * -0.07,
        alignItems: "center",
        position: "absolute",
      },
      android: {
        top: -Dimensions.get("window").height * -0.04,
        alignItems: "center",
      },
    }),
  },
  Container1: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    width: 400,
    height: -50,
    justifyContent: "space-evenly",
    paddingTop: 50,
    position: "absolute",
    ...Platform.select({
      ios: {
        top: -Dimensions.get("window").height * -0.35,
      },
      android: {
        top: -Dimensions.get("window").height * -0.32,
      },
    }),
  },
  Container2: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    width: 400,
    height: -50,
    justifyContent: "space-evenly",
    paddingTop: 50,
    position: "absolute",
    ...Platform.select({
      ios: {
        top: -Dimensions.get("window").height * -0.55,
      },
      android: {
        top: -Dimensions.get("window").height * -0.58,
      },
    }),
  },
  containerExplain: {
    ...Platform.select({
      ios: {
        top: -Dimensions.get("window").height * 0.2,
      },
      android: {
        top: -Dimensions.get("window").height * 0.25,
      },
    }),
  },
  logo: {
    width: 100,
    height: 100,
  },
  //texts
  subtitleText: {
    fontFamily: "Roboto_300Light_Italic",
    fontSize: 25,
  },
  titleText: {
    fontFamily: "YesevaOne_400Regular",
    fontSize: 47,
    color: "black",
  },
  regularText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 18,
    textAlign: "center",
  },
  explainText: {
    fontFamily: "Roboto_300Light",
    fontSize: 22,
    textAlign: "center",
  },
});
