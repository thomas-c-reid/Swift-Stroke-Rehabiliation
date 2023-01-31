import React, { useState, useEffect, useContext } from "react";
import {
  Image,
  ImageBackground,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Settings,
  Switch,
  Alert,
  SafeAreaView,
  Dimensions,
} from "react-native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { EventRegister } from "react-native-event-listeners";
import themeContext from "../config/themeContext";
import AppContext from "../constants/AppContext";

// The settings screen allows the user to update their profile, and log out from the application

function SettingsScreen({ navigation }) {
  const theme = useContext(themeContext);
  const context = useContext(AppContext);
  const [mode, setMode] = useState(false);
  const [mode2, setMode2] = useState(false);

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
          Hi {context.userName}
        </Text>
      </View>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="back" size={45} color={theme.color} />
        </TouchableOpacity>
      </View>
      <View style={styles.Container1}>
        <TouchableOpacity
          disabled={false}
          onPress={() => navigation.navigate("ChangePasswordScreen")}
        >
          <View style={styles.top}>
            <Text style={styles.regularText}>Change Password</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.Container2}>
        <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
          <View style={styles.top}>
            <Text style={styles.regularText}>Delete Account</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.Container3}>
        <Text style={styles.regularText}> Dark Mode</Text>
        <Text> </Text>
        <Switch
          trackColor={{ false: "grey", true: "#2146C7" }}
          value={mode}
          onValueChange={(value) => {
            setMode(value);
            EventRegister.emit("changeTheme", value);
            <View style={styles.logoContainer}>
              <Image
                style={styles.logo}
                source={require("../assets/SwiftLogo2White.png")}
              />
              <Text style={[styles.titleText, { color: theme.color }]}>
                Hi, {context.userName}
              </Text>
            </View>;
          }}
        />
      </View>

      <View style={styles.Container4}>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Logout", "Are you sure you want to logout?", [
              {
                text: "Cancel",
                onPress: () => {
                  console.log("Action cancelled.");
                },
              },
              {
                text: "Yes, logout",
                onPress: () => {
                  context.setJWTToken("");
                  navigation.navigate("LoginScreen");
                },
              },
            ])
          }
        >
          <Text style={styles.regularText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#CCF2F4",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  toggle: {
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
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
    flex: 1,
    alignItems: "center",
    alignContent: "space-between",
    paddingBottom: 10,
    flexDirection: "row",
    width: 360,
    height: 60,
    justifyContent: "center",
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    position: "absolute",
    backgroundColor: "#8BBCCC",
    alignSelf: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...Platform.select({
      ios: {
        //top: 250,
        top: -Dimensions.get("window").height * -0.45,
      },
      android: {
        top: -Dimensions.get("window").height * -0.49,
      },
    }),
  },
  Container4: {
    flex: 1,
    alignItems: "center",
    alignContent: "space-between",
    paddingBottom: 10,
    flexDirection: "row",
    width: 360,
    height: 60,
    //top: 500,
    justifyContent: "center",
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    position: "absolute",
    backgroundColor: "#8BBCCC",
    alignSelf: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...Platform.select({
      ios: {
        //top: 250,
        top: -Dimensions.get("window").height * -0.54,
      },
      android: {
        top: -Dimensions.get("window").height * -0.6,
      },
    }),
  },
  Container5: {
    flex: 1,
    alignItems: "center",
    alignContent: "space-between",
    paddingBottom: 10,
    flexDirection: "row",
    width: 360,
    height: 60,
    //top: 500,
    justifyContent: "center",
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    position: "absolute",
    backgroundColor: "#8BBCCC",
    alignSelf: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...Platform.select({
      ios: {
        //top: 250,
        top: -Dimensions.get("window").height * -0.63,
      },
      android: {
        top: -Dimensions.get("window").height * -0.71,
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

export default SettingsScreen;
