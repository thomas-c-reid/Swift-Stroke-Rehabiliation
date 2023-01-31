import React, {
  ActivityIndicator,
  useState,
  useEffect,
  useContext,
} from "react";
import {
  View,
  Text,
  Alert,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Dimensions,
  SafeAreaView,
} from "react-native";
import AppContext from "../constants/AppContext";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import themeContext from "../config/themeContext";

// The coordination result screen illustrates the single game results once the user has completed the game

function App({ navigation }) {
  const context = useContext(AppContext);
  const theme = useContext(themeContext);
  //explainability pop up
  const [modalVisible, setModalVisible] = useState(true);


  return (
    <SafeAreaView
      style={[styles.background, { backgroundColor: theme.background }]}
    >
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
            />
            <Text style={styles.modalTitleText}>YOUR RESULTS</Text>
            <Text style={styles.modalText}>
              {"\n"}These are your results from the most recent gameplay. This
              is not a medical diagnosis, and should only be used as an advisory
              tool.
              {"\n"}
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                  if(context.accuracy == 0)
                  {
                    Alert.alert("Results not yet loaded!");
                  }
                  else{
                    setModalVisible(!modalVisible)
                  } 
              }}
            >
              <Text style={styles.textStyle}>OK, show me my results!</Text>
            </Pressable>
          </View>
        </Modal>
      </View>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Home2")}>
          <AntDesign name="back" size={45} color={theme.color} />
        </TouchableOpacity>
      </View>

      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/SwiftLogo2.png")}
        />
        <Text style={[styles.titleText, { color: theme.color }]}>RESULTS</Text>
      </View>

      <View style={styles.container1}>
        <Text style={[styles.regularText, { color: theme.color }]}>
          {"\n"}Your accuracy was:{"\n"}
        </Text>
        <Text style={[styles.subtitleText, { color: theme.color}]}>{context.accuracy}</Text>
        <Text style={[styles.regularText, { color: theme.color }]}>
          {"\n"}Percentage change in accuracy {context.accuraciesExplanation}{" "}
          by:{"\n"}
        </Text>
        <Text style={[styles.subtitleText, { color: theme.color}]}>
        {Math.floor(context.accuracyPercentChange)}%
        </Text>

        <Text style={[styles.regularText, { color: theme.color }]}>
          {"\n"}Your time taken was:{"\n"}
        </Text>
        <Text style={[styles.subtitleText, { color: theme.color}]}>{context.timeTaken}s</Text>
        <Text style={[styles.regularText, { color: theme.color }]}>
          {"\n"}Percentage change in time taken {context.timeExplanation} by:
          {"\n"}
        </Text>
        <Text style={[styles.subtitleText, { color: theme.color}]}>{context.timePercentageChange}%</Text>
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
        top: -Dimensions.get("window").height * 0.41,
      },
      android: {
        top: -Dimensions.get("window").height * 0.46,
      },
    }),
  },

  logo: {
    width: 100,
    height: 100,
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

  subtitleText: {
    fontFamily: "Roboto_300Light",
    fontSize: 60,
    textAlign: "center",
    ...Platform.select({
      ios: {
        fontSize: 60,
      },
      android: {
        fontSize: 35,
      },
    }),
  },
  titleText: {
    fontFamily: "YesevaOne_400Regular",
    fontSize: 53,
    color: "black",
  },
  regularText: {
    fontFamily: "Roboto_400Regular_Italic",
    fontSize: 18,
    ...Platform.select({
      ios: {
        fontSize: 18,
      },
      android: {
        fontSize: 18,
      },
    }),
    textAlign: "center",
  },
  container1: {
    //flex: 1,
    alignItems: "center",
    width: 400,
    height: -50,
    justifyContent: "space-evenly",
    position: "absolute",
    paddingTop: 10,
    ...Platform.select({
      ios: {
        //top: 250,
        top: -Dimensions.get("window").height * -0.26,
      },
      android: {
        top: -Dimensions.get("window").height * -0.26,
      },
    }),
  },
  tutorialView: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 22,
    paddingRight: 20,
  },
  modalView: {
    marginLeft: 15,
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 40,
    height: 800,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    shadowColor: "#000",
    ...Platform.select({
      ios: {
        marginTop: -Dimensions.get("window").height * -0.07,
        height: Dimensions.get("screen").height * 0.9,
      },
      android: {
        marginTop: -Dimensions.get("window").height * -0.01,
        height: Dimensions.get("screen").height * 0.9,
      },
    }),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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
