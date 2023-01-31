import React, { useState, createRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
  Animated,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import AppContext from "../constants/AppContext";
import themeContext from "../config/themeContext";
import AntDesign from "react-native-vector-icons/AntDesign";

// The screen for registering a user onto the Swift application

export default function App({ navigation }) {
  //color scheme
  const theme = useContext(themeContext);

  const context = useContext(AppContext);
  const emailInputRef = createRef();
  const passwordInputRef = createRef();

  const [userName, setUserName] = useState();
  const [userPassword, setUserPassword] = useState();
  const [userEmail, setUserEmail] = useState();

  const [JSONToken, setJSONToken] = useState();

  const hostIpPort = "http://172.20.10.2:80/api/SwiftUserManagement";

  // Registering the user on the flask server
  async function registerUser() {
    if (
      userName != undefined &&
      userPassword != undefined &&
      userEmail != undefined
    ) {
      // The URL of the flask server which I will be requesting from
      const apiUrl = hostIpPort + "/createUser";
      // The body of the request
      const requestBody = {
        email: userEmail,
        username: userName,
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

      // Sends the post request to the flask server
      await fetch(apiUrl, options)
        .then((response) => response.text())
        .then((response) => {
          if (response.includes("User:")) {
            retrieveJSONToken();
            navigation.navigate("Home2");
          } else {
            alert("Invalid details/user already exists \nEnsure the email is valid \nEnsure the password is valid");
          }
        })
        .catch((error) => console.log(error));
    }
  }

  // Retrieve JSON access token from the flask server
  async function retrieveJSONToken() {
    // The URL of the flask server to authenticate a user
    const apiUrl = hostIpPort + "/auth";

    // The body of the request
    const requestBody = {
      username: userName,
      password: userPassword,
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
          alert("Invalid details");
        }
      })
      .catch((e) => {
        alert("Error with JSON authentication: " + e);
      });
  }

  // Registering the user when the submit button is hit
  const handleSubmitButton = () => {
    {
      //setErrortext('');
      if (!userName) {
        alert("Please fill in your name");
        return;
      }
      if (!userEmail) {
        alert("Please fill in your email address");
        return;
      }
      if (!userPassword) {
        alert("Please fill in a password");
        return;
      }
      registerUser();
    }
    if (JSONToken) {
      // if successful registration
      navigation.navigate("Home2");
    }

    // if unsuccessful registration
    // error: registration failed
  };

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
              REGISTER
            </Text>
          </View>
          <View style={styles.container}></View>

          <View style={styles.backButtonContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="back" size={45} color={theme.color} />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserName) => setUserName(UserName)}
              underlineColorAndroid="#f000"
              placeholder="Enter Name"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={() =>
                emailInputRef.current && emailInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.sectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserEmail) => setUserEmail(UserEmail)}
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
              blurOnSubmit={true}
            />
          </View>

          <View style={styles.button}>
            <TouchableOpacity activeOpacity={0.5} onPress={handleSubmitButton}>
              <Text style={styles.subtitleText}>
                {JSONToken ? "Click to start" : "REGISTER WITH SWIFT"}
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={{fontSize: 25, fontWeight: "bold", left: 8, fontFamily: "Roboto_300Light_Italic"}}>Ensure the password:</Text>
            <Text style={{fontSize: 20, fontFamily: "Roboto_300Light_Italic"}}>{`\u2022`} Is eight characters long</Text>
            <Text style={{fontSize: 20, fontFamily: "Roboto_300Light_Italic"}}>{`\u2022`} Has an uppercase and lowercase character</Text>
            <Text style={{fontSize: 20, fontFamily: "Roboto_300Light_Italic"}}>{`\u2022`} Has a number and a special character</Text>
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d2f3fa",
    marginBottom: -350,
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
    //elevation: 8,
    width: Dimensions.get("window").width * 0.8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 12,
    marginBottom: Dimensions.get("window").height * 0.35,
  },

  buttonText: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    alignSelf: "center",
    height: 60,
    marginTop: -18,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d2f3fa",
    marginBottom: -200,
  },
  sectionStyle: {
    //flexDirection: 'row',
    //top: -30,
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 20,
    bottom: 350,
    //width: 350,
    ...Platform.select({
      ios: {
        top: -Dimensions.get("window").height * -0.3,
        width: -Dimensions.get("window").width * -0.8,
      },
      android: {
        top: -Dimensions.get("window").height * -0.28,
        width: -Dimensions.get("window").width * -0.9,
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

  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "pink",
  },

  button: {
    backgroundColor: "#8BBCCC",
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 12,
    marginBottom: Dimensions.get("window").height * 0.35,
    ...Platform.select({
      ios: {
        top: -Dimensions.get("window").height * -0.3,
        width: -Dimensions.get("window").width * -0.8,
      },
      android: {
        top: -Dimensions.get("window").height * -0.29,
        width: -Dimensions.get("window").width * -0.9,
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
  buttonContainer: {
    justifyContent: "space-between",
    backgroundColor: "#fff",
    //padding: 130,
    margin: 10,
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
  backButtonContainer: {
    alignItems: "flex-start",
    alignSelf: "flex-start",
    margin: 30,
    paddingTop: Platform.OS === "android" ? 20 : 0,
    ...Platform.select({
      ios: {
        top: Dimensions.get("window").height * 0.2,
      },
      android: {
        top: Dimensions.get("window").height * 0.18,
      },
    }),
  },
  //icons
  logo: {
    width: 100,
    height: 100,
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
    fontSize: 15,
    textAlign: "center",
  },
});
