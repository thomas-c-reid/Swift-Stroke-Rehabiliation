import React, { useContext, useState, createRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Animated,
} from "react-native";
import AppContext from "../constants/AppContext";
import themeContext from "../config/themeContext";
import AntDesign from "react-native-vector-icons/AntDesign";

// The change password screen allows the user to change their password

export default function ChangePasswordScreen({ navigation }) {
  //color scheme
  const theme = useContext(themeContext);
  // States and global references/ variables for the sign in screen
  const context = useContext(AppContext);
  const emailInputRef = createRef();
  const passwordInputRef = createRef();
  const [userPassword, setUserPassword] = useState();
  const [passwordChangedFlag, setPasswordChangedFlag] = useState();
  const hostIpPort = "http://172.20.10.2:80/api/SwiftUserManagement";

  // Data validation for the entry points on the sign in screen
  const handleSubmitButton = () => {
    {
      if (!context.userName) {
        alert("Please fill in your username");
        return;
      }
      if (!context.oldPassword) {
        alert("Please fill in your old password");
        return;
      }
      if (!userPassword) {
        alert("Please fill in your new password");
        return;
      }
      // Navigates to home if the flag with the password changing has been received
      if (passwordChangedFlag) {
        navigation.navigate("Home2");
      }
      // Calls up the API to change the password
      changePassword();
    }
  };

  function changePassword() {
    fetch("http://172.20.10.2:80/api/SwiftUserManagement/changePassword", {
      method: "PUT",
      headers: {
        accept: "text/plain",
        Authorization: "Bearer " + context.JWTToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: context.userName,
        password: context.oldPassword,
        newPassword: userPassword,
      }),
    })
      .then((result) => result.json())
      .then((data) => {
        alert(data.message);
      });
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
              CHANGE PASSWORD
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
              onChangeText={(userName) => {
                context.setUserName(userName);
              }}
              underlineColorAndroid="#f000"
              placeholder="Enter Username"
              placeholderTextColor="#8b9cb5"
              // keyboardType="email-address"
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
              onChangeText={(oldPassword) => {
                context.setOldPassword(oldPassword);
              }}
              underlineColorAndroid="#f000"
              placeholder="Enter Old Password"
              placeholderTextColor="#8b9cb5"
              // keyboardType="email-address"
              ref={passwordInputRef}
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
              placeholder="Enter New Password"
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
                {passwordChangedFlag ? "Click to start" : "Change Password"}
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
  containerLogo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 75,
    left: 145,
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
        top: Dimensions.get("window").height * 0.35,
      },
      android: {
        top: Dimensions.get("window").height * 0.3,
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
        top: Dimensions.get("window").width * 0.8,
        marginBottom: Dimensions.get("window").height * 0.35,
      },
      android: {
        width: Dimensions.get("window").width * 0.8,
        top: Dimensions.get("window").width * 0.7,
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
        top: -Dimensions.get("window").height * -0.2,
      },
      android: {
        top: -Dimensions.get("window").height * -0.2,
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
    fontSize: 37,
    color: "black",
  },
  regularText: {
    fontFamily: "Roboto_300Light_Italic",
    fontSize: 17,
    textAlign: "center",
  },
});
