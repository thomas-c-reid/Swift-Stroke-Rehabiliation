import React, { useContext, useCallback, useState, useEffect } from "react";
import {
  Image,
  ImageBackground,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  Dimensions,
  SafeAreaView,
  Linking,
  Modal,
  Alert,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import themeContext from "../config/themeContext";
//leave feedback dependencies
import * as MailComposer from "expo-mail-composer";
import * as Print from "expo-print";

// The help screen is used to show the relevant links to websites and allows the user to leave feedback about the application

function HelpScreen({ navigation }) {
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

    MailComposer.composeAsync({
      subject: "Swift Stroke Rehabilitation - Feedback",
      recipients: ["swiftstrokerehab@gmail.com"],
    });
  };

  const supportedURL = "https://www.nhs.uk/conditions/stroke";
  const OpenURLButton = ({ url, children }) => {
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);

    return <Button title={children} onPress={handlePress} />;
  };
  const theme = useContext(themeContext);
  return (
    <SafeAreaView
      style={[styles.background, { backgroundColor: theme.background }]}
    >
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/SwiftLogo2.png")}
        />
        <Text style={[styles.titleText, { color: theme.color }]}>HELP</Text>
      </View>

      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="back" size={45} color={theme.color} />
        </TouchableOpacity>
      </View>

      <View style={styles.Container1}>
        <TouchableOpacity onPress={() => navigation.navigate("ComingSoon")}>
          <View style={styles.top}>
            <Text style={styles.regularText}>Privacy Policy</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.Container2}>
        <TouchableOpacity onPress={() => navigation.navigate("ComingSoon")}>
          <View style={styles.top}>
            <Text style={styles.regularText}>Terms of Service</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.Container3}>
        <TouchableOpacity onPress={() => navigation.navigate("ComingSoon")}>
          <View style={styles.top}>
            <OpenURLButton url={supportedURL} fontColor="black">
              More Information on Strokes
            </OpenURLButton>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.Container4}>
        <TouchableOpacity onPress={() => navigation.navigate("ComingSoon")}>
          <View style={styles.top}>
            <Text style={styles.regularText}>Contact Us</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.Container5}>
        <TouchableOpacity>
          <View style={styles.top}>
            {isAvailable ? (
              <Button title="Leave Feedback" onPress={sendMail} />
            ) : (
              //NOTE: iOS Emulator will NOT show leave feedback email function
              //works when running on any real device or android emulator
              <Text
                style={[
                  styles.regularText,
                  { fontSize: 20 },
                  { color: theme.color },
                ]}
              >
                Leave Feedback Unavailable
              </Text>
            )}
          </View>
        </TouchableOpacity>
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
  Container2: {
    //flex: 1,
    alignItems: "center",
    width: 500,
    height: -50,
    justifyContent: "space-evenly",
    position: "absolute",
    paddingTop: 10,
    ...Platform.select({
      ios: {
        //top: 250,
        top: -Dimensions.get("window").height * -0.35,
      },
      android: {
        top: -Dimensions.get("window").height * -0.37,
      },
    }),
  },
  Container3: {
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
        top: -Dimensions.get("window").height * -0.44,
      },
      android: {
        top: -Dimensions.get("window").height * -0.48,
      },
    }),
  },
  Container4: {
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
        top: -Dimensions.get("window").height * -0.53,
      },
      android: {
        top: -Dimensions.get("window").height * -0.59,
      },
    }),
  },
  Container5: {
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
        top: -Dimensions.get("window").height * -0.62,
      },
      android: {
        top: -Dimensions.get("window").height * -0.7,
      },
    }),
  },
  buttonContainer: {
    justifyContent: "space-between",
    backgroundColor: "#fff",
    //padding: 130,
    margin: 10,
  },
  top: {
    flex: 0.3,
    backgroundColor: "#8BBCCC",
    //borderWidth: 4,
    //padding: 30,
    width: 360,
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "center",
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
  goBackButton: {
    width: 55,
    height: 55,
    //top: 50,
  },
  //icons
  logo: {
    width: 100,
    height: 100,
  },
  //texts
  subtitleText: {
    fontFamily: "Roboto_300Light_Italic",
    fontSize: 23,
  },
  titleText: {
    fontFamily: "YesevaOne_400Regular",
    fontSize: 45,
    color: "black",
  },
  regularText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 18,
    textAlign: "center",
  },
});

export default HelpScreen;
