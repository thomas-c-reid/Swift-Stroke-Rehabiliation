import React, { useRef, useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Alert,
} from "react-native";

//Google authentication
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

// Start google authentication
WebBrowser.maybeCompleteAuthSession();

// The login screen
function LoginScreen({ navigation }) {
  // Google authentication states
  const [googleAccessToken, setgoogleAccessToken] = useState();
  const [userInfo, setUserInfo] = useState({
    email: "",
    username: "",
    password: "",
  });

  // JSON Token stae
  const [JSONToken, setJSONToken] = useState();

  // User Registered state
  const [registerFlag, setRegisterFlag] = useState();

  // Server Connected State
  const [serverConnected, setServerConnected] = useState(false);

  // Function to check if the app is connected to the server
  function checkInternetConnection() {
    let resultEndpoint =
      "http://172.20.10.2:80/api/SwiftUserManagement/pingServer";

    const message = fetch(resultEndpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      // handle response
      .then((response) => response.json())
      .then((data) => {
        setServerConnected(true);
      })
      .catch((error) => {
        setServerConnected(false);
      });
  }

  // Checking if the app is connected to the server
  useEffect(() => {
    checkInternetConnection();
  }, []);

  // Configuration for google authentication
  // Keys had to be taken from the google cloud console
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "540459888593-va0jt48o15os4faqrpprh9iq859vobpf.apps.googleusercontent.com",
    expoClientId:
      "540459888593-7i6t59fe1ubncmsh0ih9tn6ov21cosjf.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.io/@swift-rehab/swift-Rehab",
    scopes: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "openid",
    ],
  });

  // If authentication succeeds it sets the access token when the response is set
  React.useEffect(() => {
    if (response?.type === "success") {
      setgoogleAccessToken(response.authentication.accessToken);
    }
  }, [response]);

  // When the user info has been set, it will get user data
  React.useEffect(() => {
    getUserData();
  }, [googleAccessToken]);

  // When the user data has been received, register the user onto the database
  React.useEffect(() => {
    if (userInfo.email && registerFlag) {
      googleRegisterUser().then(() => {
        retrieveJSONToken();
      });
    } else if (userInfo.email) {
      retrieveJSONToken();
    }
  }, [userInfo]);

  // When the JSON access token exists, it will let the user into the app
  React.useEffect(() => {
    console.log(JSONToken);
    //setModalState(!modalState);
    //navigation.navigate("Home");
  }, [JSONToken]);

  // Gets the user data and sets it into the userInfoResponse variable
  async function getUserData() {
    let userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${googleAccessToken}` },
      }
    ).catch((e) => {
      alert("Error with get user data: " + e);
    });

    userInfoResponse
      .json()
      .then((data) => {
        setUserInfo(data);
      })
      .catch((e) => {
        alert("Error with Json of user data: " + e);
      });
  }

  // Registers the user onto the database in the flask server
  const hostIpPort = "http://172.20.10.2:80/api/SwiftUserManagement";
  async function googleRegisterUser() {
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
          } else {
            alert("Invalid details/ user already exists");
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
      username: userInfo.email,
      password: userInfo.id,
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

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/BackgroundLogin.jpg")}
    >
      <Animated.View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/SwiftLogo2.png")}
        />
        <Text style={styles.titleText}>SWIFT</Text>
        <Text style={styles.subtitleText}>Stroke Rehabilitation</Text>
        <Text
          style={[
            styles.serverConnectedText,
            serverConnected ? { color: "green" } : { color: "red" },
          ]}
        >
          {serverConnected ? "Server connected" : "Server not connected"}
        </Text>
      </Animated.View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() =>
          serverConnected
            ? navigation.navigate("SignInScreen")
            : alert("You are not connected to the server, can't access app")
        }
      >
        <View style={styles.loginButton}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginWithGoogleButton}
        onPress={() => {
          if (!serverConnected) {
            alert("You are not connected to the server");
          }
          setRegisterFlag(true);
          if (JSONToken) {
            setModalState(!modalState);
            navigation.navigate("Home2");
          } else {
            promptAsync({ showInRecents: true })
              .then(getUserData())
              .catch((e) => {
                alert("Error in opening google authentication screen: " + e);
              });
          }
        }}
      >
        <Text style={styles.buttonText}>
          {googleAccessToken ? "Click to start" : "LOGIN WITH GOOGLE"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() =>
          serverConnected
            ? navigation.navigate("RegisterScreen")
            : alert("You are not connected to the server, can't access app")
        }
      >
        <View style={styles.registerButton}>
          <Text style={styles.buttonText}>REGISTER</Text>
        </View>
      </TouchableOpacity>
    </ImageBackground>
  );
}

//styles for screen
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end", //drops login button to bottom of screen
    alignItems: "center",
  },
  loginButton: {
    width: "100%",
    height: 70,
    backgroundColor: "#BCCEF8",
    justifyContent: "center",
  },
  loginWithGoogleButton: {
    width: "100%",
    height: 70,
    backgroundColor: "#8BBCCC",
    justifyContent: "center",
  },
  registerButton: {
    width: "100%",
    height: 70,
    backgroundColor: "#9ED5C5",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
  },
  logoContainer: {
    position: "absolute",
    top: 80,
    alignItems: "center",
  },
  titleText: {
    fontFamily: "YesevaOne_400Regular",
    fontSize: 53,
  },
  subtitleText: {
    fontFamily: "Roboto_300Light_Italic",
    fontSize: 28,
  },
  buttonText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 30,
    textAlign: "center",
  },
});

export default LoginScreen;
