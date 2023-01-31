import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import AppContext from "../constants/AppContext";
import {
  VictoryLine,
  VictoryChart,
  VictoryTheme,
  VictoryScatter,
  VictoryLabel,
  VictoryAxis,
} from "victory-native";
import RadioForm from "react-native-simple-radio-button";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import theme from "../config/theme";
import themeContext from "../config/themeContext";
import AntDesign from "react-native-vector-icons/AntDesign";

// The line result screen allow th user to view their progress over time on a line chart

function App({ navigation }) {
  const [chart, setChart] = useState(0);

  const context = useContext(AppContext);
  const theme = useContext(themeContext);

  
  const radio_props = [
    { label: "Accuracy", value: 0 },
    { label: "Time", value: 1 },
  ];

  const game1TimeLine = (
    <VictoryLine
      name="Game1TimeLine"
      style={{
        data: { stroke: "red" },
        parent: { border: "1px solid #ccc" },
      }}
      data={context.timeGraphResults}
      x="x"
      y="y"
      animate={{
        duration: 2000,
        onLoad: { duration: 1000 },
      }}
    />
  );

  const game1TimeScatter = (
    <VictoryScatter
      name="Game1TimeScatter"
      style={{ data: { fill: "red" } }}
      size={5}
      data={context.timeGraphResults}
    />
  );


  const game1AccuracyLine = (
    <VictoryLine
      name="Game1AccuracyLine"
      style={{
        data: { stroke: "red" },
        parent: { border: "1px solid #ccc" },
      }}
      data={context.accuracyGraphResults}
      x="x"
      y="y"
      animate={{
        duration: 2000,
        onLoad: { duration: 1000 },
      }}
    />
  );

  const game1AccuracyScatter = (
    <VictoryScatter
      name="Game1AccuracyScatter"
      style={{ data: { fill: "red" } }}
      size={5}
      data={context.accuracyGraphResults}
    />
  );

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
          PROGRESS RESULTS
        </Text>
      </View>

      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="back" size={45} color={theme.color} />
        </TouchableOpacity>
      </View>
      <RadioForm
        radio_props={radio_props}
        formHorizontal={true}
        labelHorizontal={false}
        buttonColor={"#2196f3"}
        onPress={(value) => setChart(value)}
      />
      <View>
        <VictoryChart
          theme={VictoryTheme.material}
          padding={{ top: 10, bottom: 80, left: 60, right: 35 }}
        >
          <VictoryAxis
            label={"Date"}
            style={{
              axisLabel: { fontSize: 18, padding: 60 },
              tickLabels: {angle :-50, padding: 20,},
            }}
          />
          {chart === 0 ? (
            <VictoryAxis
              dependentAxis
              label={"Accuracy (%)"}
              style={{
                axisLabel: { fontSize: 18, padding: 35 },
              }}
            />
          ) : (
            <VictoryAxis
              dependentAxis
              label={"Time (s)"}
              style={{
                axisLabel: { fontSize: 18, padding: 35 },
              }}
            />
          )}

          {chart === 0 ? game1AccuracyLine : game1TimeLine}
          {chart === 0 ? game1AccuracyScatter : game1TimeScatter}
        </VictoryChart>
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

  logo: {
    height: 75,
    width: 100,
    resizeMode: "contain",
    top: -Dimensions.get("window").height * 0.13,
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
  backButtonContainer: {
    alignItems: "flex-start",
    alignSelf: "flex-start",
    margin: 30,
    paddingTop: Platform.OS === "android" ? 20 : 0,
    ...Platform.select({
      ios: {
        top: -Dimensions.get("window").height * 0.18,
      },
      android: {
        top: -Dimensions.get("window").height * 0.17,
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
    fontSize: 37,
    color: "black",
  },
  regularText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 18,
    textAlign: "center",
  },
});
