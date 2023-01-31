import React, { useContext, useState, useEffect, Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageBackground,
  Text,
  Modal,
  Pressable,
  SafeAreaView,
} from "react-native";
import {
  VictoryPolarAxis,
  VictoryChart,
  VictoryTheme,
  VictoryGroup,
  VictoryArea,
  VictoryLabel,
  VictoryLegend,
} from "victory-native";
import AppContext from "../constants/AppContext";
import theme from "../config/theme";
import themeContext from "../config/themeContext";
import AntDesign from "react-native-vector-icons/AntDesign";
import { BottomTabBarHeightCallbackContext } from "@react-navigation/bottom-tabs";

const characterData = [
  { engagement: 6, time: 15, accuracy: 75 },
];

// The radar results screen shows an example of perfect data, and compares it to the users current data on a radar chart to see how they are getting on

class RadarResultScreen extends Component {
  static contextType = AppContext;

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: this.processData(this.context.radarGraphResults),
      maxima: this.getMaxima(this.context.radarGraphResults),
    };
  }

  getMaxima(data) {
    const groupedData = Object.keys(data[0]).reduce((memo, key) => {
      memo[key] = data.map((d) => d[key]);
      return memo;
    }, {});
    return Object.keys(groupedData).reduce((memo, key) => {
      memo[key] = Math.max(...groupedData[key]);
      return memo;
    }, {});
  }

  processData(data) {
    const maxByGroup = this.getMaxima(data);
    const makeDataArray = (d) => {
      return Object.keys(d).map((key) => {
        return { x: key, y: d[key] / maxByGroup[key] };
      });
    };
    return data.map((datum) => makeDataArray(datum));
  }

  //results explained
  state = {
    modalVisible: false,
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  render() {
    const { modalVisible } = this.state;
    return (
      <SafeAreaView style={styles.background}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../assets/SwiftLogo2.png")}
          />
          <Text style={[styles.titleText, { color: theme.color }]}>
            SUMMARY RESULTS
          </Text>
        </View>

        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <AntDesign name="back" size={45} color={theme.color} />
          </TouchableOpacity>
        </View>

        <View style={styles.legend}>
        <VictoryLegend x={100} y={0}
              title="  Legend"
              centerTitle
              orientation="horizontal"
              style={{title: {fontSize: 20}}}
              data={[
                {name: "Ideal results", symbol: {fill:"tomato"}},
                {name: "Your results", symbol: {fill:"gold"}}
              ]}
            />
        </View>
        <View style={styles.chart}>
          <VictoryChart
            polar
            theme={VictoryTheme.material}
            domain={{ y: [0, 1]}}
          >
            <VictoryGroup
              colorScale={["gold", "tomato", "orange"]}
              style={{ data: { fillOpacity: 0.2, strokeWidth: 2 } }}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 },
              }}
            >
              {this.state.data.map((data, i) => {
                return <VictoryArea key={i} data={data} />;
              })}
            </VictoryGroup>
            {Object.keys(this.state.maxima).map((key, i) => {
              return (
                <VictoryPolarAxis
                  key={i}
                  dependentAxis
                  style={{
                    axisLabel: { padding: 25, fontSize: 20 },
                    axis: { stroke: "none" },
                    grid: { stroke: "grey", strokeWidth: 0.25, opacity: 0.5 },
                  }}
                  tickLabelComponent={
                    <VictoryLabel labelPlacement="vertical" />
                  }
                  labelPlacement="perpendicular"
                  axisValue={i + 1}
                  label={key}
                  tickFormat={(t) => Math.ceil(t * this.state.maxima[key])}
                  tickValues={[0.25, 0.5, 0.75, 1]}
                />
              );
            })}
            <VictoryPolarAxis
              labelPlacement="parallel"
              tickFormat={() => ""}
              style={{
                axis: { stroke: "none" },
                grid: { stroke: "grey", opacity: 0.5 },
              }}
            />
          </VictoryChart>
        </View>

        <View style={styles.tutorialView}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              this.setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalTitleText}>RESULTS</Text>
              <Text style={styles.modalText}>
                {"\n"}
                <Text style={{fontSize: 18}}>All results are from the last seven days.{"\n"}</Text>
                {"\n"}
                <Text style={{ fontWeight: "bold" }}>ACCURACY: </Text>This is
                your average accuracy in the coordination game.{"\n"}
                {"\n"}
                <Text style={{ fontWeight: "bold" }}>TIME: </Text>This is your
                average time taken to complete the coordination game in seconds.{"\n"}
                {"\n"}
                <Text style={{ fontWeight: "bold" }}>ENGAGEMENT: </Text>This is
                the number of days you have played the coordination game.{"\n"}
                {"\n"}
                <Text style={{ fontWeight: "bold" }}>DIFFICULTY: </Text>This is
                your average difficulty level played in the coordination game.{"\n"}
              </Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => this.setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </Modal>
          <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => this.setModalVisible(true)}
          >
            <Text style={styles.textStyle}>Explain my Results!</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }
}

RadarResultScreen.contextType = AppContext;

export default RadarResultScreen;

const styles = StyleSheet.create({
  
  background: {
    flex: 1,
    backgroundColor: "#CCF2F4",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? 50 : 0,
    //backgroundColor: theme.background,
  },
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
        top: -Dimensions.get("window").height * 0.2,
      },
      android: {
        top: -Dimensions.get("window").height * 0.24,
      },
    }),
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
  logoutText: {
    fontSize: 18,
    fontFamily: "Roboto_300Light_Italic",
    textAlign: "center",
  },
  //icons
  logo: {
    width: 100,
    height: 100,
  },
  legend: {
    top: 580,
    position: "absolute",
    left: -10
  },
  chart: {
    //marginTop: 50,
    //height: 350,
    ...Platform.select({
      ios: {
        top: -Dimensions.get("window").height * 0.1,
      },
      android: {
        top: -Dimensions.get("window").height * 0.1,
      },
    }),
  },
  //modal
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
        height: -Dimensions.get("window").height * -0.7,
        marginTop: Dimensions.get("window").height * 0.15,
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
    marginBottom: -80,
    marginLeft: 20,  },
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
    fontSize: 20,
  },
});
