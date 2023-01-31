import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  Suspense,
} from "react";
import {
  Image,
  ImageBackground,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  Button,
  SafeAreaView,
  Platform,
  Touchable,
} from "react-native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import AntDesign from "react-native-vector-icons/AntDesign";
import theme from "../config/theme";
import themeContext from "../config/themeContext";
import AppContext from "../constants/AppContext";
//email dependencies
import * as MailComposer from "expo-mail-composer";
import * as Print from "expo-print";

// The home screen is the main screen of the application and includes all the functions which the user may need to use

function HomeScreen({ navigation }) {
  const context = useContext(AppContext);
  const theme = useContext(themeContext);

  function retrieveGameResultsFromBackEnd(id, username) {
    fetch(
      "http://172.20.10.2:80/api/SwiftUserManagement/retrieveGameResults",
      {
        method: "POST",
        headers: {
          accept: "text/plain",
          Authorization: "Bearer " + context.JWTToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserName: username,
          User_Id: id,
          AmountOfDataResults: 2,
        }),
      }
    )
      .then((result) => result.json())
      .then((data) => {
        // context.setAccuracyGraphResults(data.accuracyHistoricResults);
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
        ];
        context.setRadarGraphResults(tempArrayRadar);
      });
  }

  // Getting the username and user id to be able to call the other endpoints
  async function GetUserByEmail() {
    //use app context
    const baseUrl = "http://172.20.10.2:80/api/SwiftUserManagement/email/";
    const query = context.userEmail;
    var completeUrl = baseUrl + encodeURIComponent(query);

    await fetch(completeUrl, {
      headers: {
        accept: "text/plain",
        Authorization: "Bearer " + context.JWTToken,
      },
    })
      .then((result) => result.json())
      .then((data) => {
        context.setUserName(data.userName);
        context.setUserEmail(data.email);
        context.setUserId(data.id);
        console.log(
          "Received email for user data: \n" +
            data.userName +
            "\n" +
            data.email +
            "\n" +
            data.id +
            "\n\n"
        );

        retrieveGameResultsFromBackEnd(data.id, data.userName);
      });
  }

  // Retrieving user details
  React.useEffect(() => {
    GetUserByEmail();
  }, []);

  //sending email feature
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    async function checkAvailability() {
      const isMailAvailable = await MailComposer.isAvailableAsync();
      setIsAvailable(isMailAvailable);
    }
    checkAvailability();
  }, []);

  const sendMail = async () => {
    const { uri } = await Print.printToFileAsync({
      html: "<h1>My pdf!</h1>",
    });

    console.log("In mail: " + context.radarGraphResults.time);

    if (context.radarGraphResults[0].time === undefined) {
      alert("The data hasn't been retrieved yet");
      return;
    }

    MailComposer.composeAsync({
      subject: "Swift Stroke Rehabilitation - Results",
      body:
        "Hi!\n\nHere's a copy of my weekly progress from the Swift Stroke Rehabilitation App.\n\nAverage Time Taken: " +
        context.radarGraphResults[0].time +
        "\nAverage Accuracy: " +
        context.radarGraphResults[0].accuracy +
        " \nAverage Difficulty: " +
        context.radarGraphResults[0].difficulty +
        " \nAverage Engagement: " +
        context.radarGraphResults[0].engagement +
        "\n\nHope this is beneficial!",
      recipients: ["medicalprofessional@example.com "],
    });
  };

  const FadeInView = (props) => {
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim]);

    return (
      <Animated.View // Special animatable View
        style={{
          ...props.style,
          opacity: fadeAnim, // Bind opacity to animated value
        }}
      >
        {props.children}
      </Animated.View>
    );
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
        <Text style={[styles.titleText, { color: theme.color }]}>HOME</Text>
        <Text></Text>
      </View>
      <View style={styles.subtitle}>
        <Text style={[styles.subtitleText, { color: theme.color }]}>
          What would you like to do today?
        </Text>
      </View>

      <View style={styles.Container1}>
        <TouchableOpacity
          onPress={() => navigation.navigate("CoordinationScreen")}
        >
          <Ionicons name="eye-outline" size={110} color={theme.color} />
          <Text style={[styles.regularText, { color: theme.color }]}>
            Coordination
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("StrengthScreen")}>
          <MaterialCommunityIcons
            name="arm-flex-outline"
            size={110}
            color={theme.color}
          />
          <Text style={[styles.regularText, { color: theme.color }]}>
            Strength Test
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.Container2}>
        <TouchableOpacity onPress={() => navigation.navigate("ComingSoon")}>
          <Ionicons name="camera-outline" size={110} color={theme.color} />
          <Text style={[styles.regularText, { color: theme.color }]}>
            Selfie Check
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("ComingSoon")}>
          <SimpleLineIcons name="speech" size={100} color={theme.color} />
          <Text style={[styles.regularText, { color: theme.color }]}>
            Speech
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.Container3}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ViewResultsScreen")}
        >
          <AntDesign
            name="linechart"
            style={styles.linechartIcons}
            color={theme.color}
          />
          <Text style={[styles.regularText, { color: theme.color }]}>
            View Results
          </Text>
        </TouchableOpacity>

        {isAvailable ? (
          <TouchableOpacity onPress={() => sendMail()}>
            <Fontisto
              name="email"
              size={100}
              color={theme.color}
              alignItems="center"
              justifyContent="flex-end"
            />
            <Text style={[styles.regularText, { color: theme.color }]}>
              Send Mail
            </Text>
          </TouchableOpacity>
        ) : (
          //NOTE: iOS Emulator will NOT show email function
          //works when running on real device
          <Text
            style={[
              styles.regularText,
              { fontSize: 20 },
              { color: theme.color },
            ]}
          >
            Email unavailable
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  logoutColor: {
    color: theme.color,
  },
  //containers
  logoContainer: {
    alignItems: "center",
    position: "absolute",
    ...Platform.select({
      ios: {
        top: -Dimensions.get("window").height * -0.05,
        alignItems: "center",
        position: "absolute",
      },
      android: {
        top: -Dimensions.get("window").height * -0.03,
        alignItems: "center",
      },
    }),
  },
  Container1: {
    //flex: 1,
    flexDirection: "row",
    alignItems: "center",
    width: 400,
    height: -50,
    justifyContent: "space-evenly",
    position: "absolute",
    paddingTop: 50,
    ...Platform.select({
      ios: {
        //top: 250,
        top: -Dimensions.get("window").height * -0.27,
      },
      android: {
        top: -Dimensions.get("window").height * -0.27,
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
    paddingTop: 70,
    position: "absolute",
    ...Platform.select({
      ios: {
        top: -Dimensions.get("window").height * -0.43,
      },
      android: {
        top: -Dimensions.get("window").height * -0.43,
      },
    }),
  },
  Container3: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    width: 450,
    height: -50,
    top: 570,
    justifyContent: "space-evenly",
    paddingTop: 80,
    position: "absolute",
    ...Platform.select({
      ios: {
        top: -Dimensions.get("window").height * -0.61,
        paddingLeft: 15,
      },
      android: {
        top: -Dimensions.get("window").height * -0.61,
        paddingLeft: 20,
      },
    }),
  },
  //icons
  logo: {
    width: -Dimensions.get("window").width * -0.35,
    height: -Dimensions.get("window").height * -0.15,
  },

  logoutButtonContainer: {
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
  subtitle: {
    top: -Dimensions.get("window").height * 0.19,
  },
  //texts
  subtitleText: {
    fontFamily: "Roboto_300Light_Italic",
    fontSize: 25,
  },
  titleText: {
    fontFamily: "YesevaOne_400Regular",
    fontSize: 53,
    color: "black",
  },
  regularText: {
    fontFamily: "Roboto_400Regular_Italic",
    fontSize: 20,
    textAlign: "center",
  },
  logoutText: {
    fontSize: 18,
    fontFamily: "Roboto_300Light_Italic",
    textAlign: "center",
  },
  linechartIcons: {
    fontSize: 90, //changes size of icon
  },
});

export default HomeScreen;
