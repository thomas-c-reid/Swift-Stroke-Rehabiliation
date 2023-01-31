import React, { useContext, useState, createRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  Keyboard,
  ImageBackground,
  KeyboardAvoidingView,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
} from "react-native";
import AppContext from "../constants/AppContext";
import themeContext from "../config/themeContext";
import AntDesign from "react-native-vector-icons/AntDesign";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// The sign in screen allows the user to sign into the application

export default function SignInScreen({ navigation }) {
  //color scheme
  const theme = useContext(themeContext);
  // States and global references/ variables for the sign in screen
  const context = useContext(AppContext);
  const emailInputRef = createRef();
  const passwordInputRef = createRef();
  const [userPassword, setUserPassword] = useState();
  const [userEmail, setUserEmail] = useState();
  const [JSONToken, setJSONToken] = useState();
  const hostIpPort = "http://172.20.10.2:80/api/SwiftUserManagement";

  // Data validation for the entry points on the sign in screen
  const handleSubmitButton = () => {
    {
      if (!userEmail) {
        alert("Please fill in your email address");
        return;
      }
      if (!userPassword) {
        alert("Please fill in your password");
        return;
      }
      // Navigates to home if the json token has been received
      if (JSONToken) {
        navigation.navigate("Home2");
      }
      // Calls up the API to receive the JSON web token
      retrieveJSONToken();
    }
  };

  // Retrieve JSON access token from the flask server
  async function retrieveJSONToken() {
    // The URL of the flask server to authenticate a user
    const apiUrl = hostIpPort + "/auth";

    // The body of the request
    const requestBody = {
      userName: "michal",
      email: userEmail,
      password: userPassword,
      role: "User",
    };

    // The setup of the fetch command for the request
    const options = {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Sends the POST request to the server
    await fetch(apiUrl, options)
      .then((result) => result.json())
      .then((data) => {
        if (data.token) {
          setJSONToken(data.token);
          context.setJWTToken(data.token);
        } else {
          alert("Invalid details" + " " + data.token);
        }
      });
    //.catch((e) => {
    //alert("Error with JSON authentication: " + e);
    //});
  }

  // Styling and JSX for the sign in screen
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: theme.background }}>
        <SafeAreaView
          style={[styles.background, { backgroundColor: theme.background }]}
        >
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require("../assets/SwiftLogo2.png")}
            />
            <Text style={[styles.titleText, { color: theme.color }]}>
              LOGIN
            </Text>
          </View>

          <View style={styles.backButtonContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="back" size={45} color={theme.color} />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserEmail) => {
                setUserEmail(UserEmail);
                context.setUserEmail(UserEmail);
              }}
              underlineColorAndroid="#f000"
              placeholder="Enter Email"
              placeholderTextColor="#8b9cb5"
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current && passwordInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.sectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserPassword) => setUserPassword(UserPassword)}
              underlineColorAndroid="#f000"
              placeholder="Enter Password"
              placeholderTextColor="#8b9cb5"
              ref={passwordInputRef}
              returnKeyType="next"
              secureTextEntry={true}
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.button}>
            <TouchableOpacity activeOpacity={0.5} onPress={handleSubmitButton}>
              <Text style={[styles.subtitleText, { color: theme.color }]}>
                {JSONToken ? "Click to start" : "LOGIN TO SWIFT"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.forgotPassword}>
            <TouchableOpacity onPress={() => navigation.navigate("ComingSoon")}>
              <Text style={[styles.regularText, { color: theme.color }]}>
                Forgot your password?
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/// Just some styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#CCF2F4",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d2f3fa",
    marginBottom: -200,
  },
  sectionStyle: {
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 20,
    bottom: 350,
    width: 350,
    position: "relative",
    ...Platform.select({
      ios: {
        top: -Dimensions.get("window").height * -0.1,
      },
      android: {
        top: -Dimensions.get("window").height * -0.02,
      },
    }),
  },
  inputStyle: {
    flex: 1,
    color: "black",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#dadae8",
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#8BBCCC",
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 12,
    ...Platform.select({
      ios: {
        width: Dimensions.get("window").width * 0.8,
        top: Dimensions.get("window").width * 0.3,
        marginBottom: Dimensions.get("window").height * 0.35,
      },
      android: {
        width: Dimensions.get("window").width * 0.8,
        top: Dimensions.get("window").width * 0.1,
        marginBottom: Dimensions.get("window").height * 0.35,
      },
    }),
  },
  buttonText: {
    fontSize: 30,
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
    height: 60,
    marginTop: -18,
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
        top: -Dimensions.get("window").height * 0.01,
      },
      android: {
        top: -Dimensions.get("window").height * 0.07,
      },
    }),
  },
  logo: {
    width: 100,
    height: 100,
  },
  forgotPassword: {
    ...Platform.select({
      ios: {
        top: -Dimensions.get("window").height * 0.2,
      },
      android: {
        top: -Dimensions.get("window").height * 0.3,
      },
    }),
  },
  //texts
  subtitleText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 23,
    textAlign: "center",
  },
  titleText: {
    fontFamily: "YesevaOne_400Regular",
    fontSize: 45,
    color: "black",
  },
  regularText: {
    fontFamily: "Roboto_300Light_Italic",
    fontSize: 17,
    textAlign: "center",
    /*
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        backgroundColor="pink"
        keyboardVerticalOffset={Platform.select({
          ios: () => 0,
          android: () => 300,
        })()}
      >
      */
  },
});
