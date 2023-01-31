import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Appearance, LogBox } from "react-native";
import { useColorScheme } from "react-native";
import LoginScreen from "./app/screens/LoginScreen";
import HomeScreen from "./app/screens/HomeScreen";
import ComingSoonScreen from "./app/screens/ComingSoonScreen";
import CoordinationScreen from "./app/screens/CoordinationScreen";
import AppContext from "./app/constants/AppContext";
import StrengthScreen from "./app/screens/StrengthScreen";
import RegisterScreen from "./app/screens/RegisterScreen";
import ViewResultsScreen from "./app/screens/ViewResultsScreen";
import SignInScreen from "./app/screens/SignInScreen";
import RadarResultScreen from "./app/screens/RadarResultScreen";
import LineResultScreen from "./app/screens/LineResultScreen";
import CoordinationResult from "./app/screens/CoordinationResult";
import LoadingScreen from "./app/screens/LoadingScreen";
import { Circle } from "./app/components/Circle";
import ChangePasswordScreen from "./app/screens/ChangePasswordScreen";

//custom fonts - title
import { YesevaOne_400Regular } from "@expo-google-fonts/yeseva-one";
//custom fonts - regular text
import {
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_300Light,
  Roboto_300Light_Italic,
} from "@expo-google-fonts/roboto";
import { useFonts } from "expo-font";
//errorhandling
import AppLoading from "expo-app-loading";
//splash screen
import * as SplashScreen from "expo-splash-screen";
//app navigation
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";
import TabNavigator from "./app/navigation/TabNavigator";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import SettingsScreen from "./app/screens/SettingsScreen";
import HelpScreen from "./app/screens/HelpScreen";
import { EventRegister } from "react-native-event-listeners";
//dark mode
import themeContext from "./app/config/themeContext";
import theme from "./app/config/theme";

export default function App() {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();
  const scheme = useColorScheme();

  // States which will be used to control functions across the whole app
  const [serverConnected, setServerConnected] = useState(false);
  const [prediction, setPrediction] = useState("false");
  const [login, setLogin] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [audioPermission, setAudioPermission] = useState(false);
  const [storagePermission, setStoragePermission] = useState(false);
  const [JWTToken, setJWTToken] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [mode, setMode] = useState(false);
  const [mode2, setMode2] = useState(false);
  const [accuraciesExplanation, setAccuraciesExplanation] = useState("");
  const [accuracy, setAccuracy] = useState(0);
  const [accuracyPercentChange, setAccuracyPercentChange] = useState(0.0);
  const [difficulty, setDifficulty] = useState(0);
  const [timeExplanation, setTimeExplanation] = useState("");
  const [timePercentageChange, setTimePercentageChange] = useState(0.0);
  const [timeTaken, setTimeTaken] = useState(0.0);
  const [oldPassword, setOldPassword] = useState("");
  const [accuracyGraphResults, setAccuracyGraphResults] = useState([]);
  const [timeGraphResults, setTimeGraphResults] = useState([]);
  const [radarGraphResults, setRadarGraphResults] = useState([
    { engagement: 6, time: 15, accuracy: 75 },
  ]);

  //toggles (setters) for ach global variable
  const toggleCameraPermssion = () => {
    if (cameraPermission) {
      setCameraPermission(false);
    } else {
      setCameraPermission(true);
    }
  };

  const toggleStoragePermssion = () => {
    if (storagePermission) {
      setStoragePermission(false);
    } else {
      setStoragePermission(true);
    }
  };

  const toggleAudioPermssion = () => {
    if (audioPermission) {
      setAudioPermission(false);
    } else {
      setAudioPermission(true);
    }
  };

  const toggleLogin = () => {
    if (audioPermission) {
      setLogin(false);
    } else {
      setLogin(true);
    }
  };

  const toggleServerConnected = () => {
    if (serverConnected) {
      setServerConnected(false);
    } else {
      setServerConnected(true);
    }
  };

  const updatePrediction = (serverResult) => {
    setPrediction(serverResult);
  };

  //object containing global vars
  const userSettings = {
    endpoint: "http://172.20.10.2:80/api/SwiftUserManagement",
    serverConnected: serverConnected,
    //setServerConnected,
    toggleServerConnected,
    //prediction most recently returned
    prediction: prediction,
    //set prediction
    setPrediction,
    login: login,
    //setLogin,
    toggleLogin,
    cameraPermission: cameraPermission,
    //setCameraPermission,
    toggleCameraPermssion,
    audioPermission: audioPermission,
    //setAudioPermission,
    toggleAudioPermssion,
    storagePermission: storagePermission,
    //setStoragePermission,
    toggleStoragePermssion,
    JWTToken: JWTToken,
    setJWTToken,
    userEmail: userEmail,
    setUserEmail,
    userName: userName,
    setUserName,
    userId: userId,
    setUserId,
    accuraciesExplanation: accuraciesExplanation,
    setAccuraciesExplanation,
    accuracy: accuracy,
    setAccuracy,
    accuracyPercentChange: accuracyPercentChange,
    setAccuracyPercentChange,
    difficulty: difficulty,
    setDifficulty,
    timeExplanation: timeExplanation,
    setTimeExplanation,
    timePercentageChange: timePercentageChange,
    setTimePercentageChange,
    timeTaken: timeTaken,
    setTimeTaken,
    oldPassword: oldPassword,
    setOldPassword,
    accuracyGraphResults: accuracyGraphResults,
    setAccuracyGraphResults,
    timeGraphResults: timeGraphResults,
    setTimeGraphResults,
    radarGraphResults: radarGraphResults,
    setRadarGraphResults,
  };

  useEffect(() => {
    let eventListener = EventRegister.addEventListener(
      "changeTheme",

      (data) => {
        setMode(data);
        setMode2(data);
      }
    );
  });

  //displays splash screen loading for 2s - using for testing, can change in future
  SplashScreen.preventAutoHideAsync();
  setTimeout(SplashScreen.hideAsync, 2000);

  let [fontsLoaded, error] = useFonts({
    YesevaOne_400Regular,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
  });

  if (fontsLoaded) {
    //navigation stack
    LogBox.ignoreAllLogs();
    return (
      <AppContext.Provider value={userSettings} value2={userSettings}>
        <themeContext.Provider
          value={mode === true ? theme.dark : theme.light}
          value2={mode2 === true ? theme.colorblind : theme.light}
        >
          <NavigationContainer>
            <Stack.Navigator>
            <Stack.Screen
                component={LoginScreen}
                name="LoginScreen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={TabNavigator}
                name="Home2"
                options={{ headerShown: false }}
              />
              
              <Stack.Screen
                component={SignInScreen}
                name="SignInScreen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={RegisterScreen}
                name="RegisterScreen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={ChangePasswordScreen}
                name="ChangePasswordScreen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={SettingsScreen}
                name="SettingsScreen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={HelpScreen}
                name="HelpScreen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={ComingSoonScreen}
                name="ComingSoon"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={CoordinationScreen}
                name="CoordinationScreen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={CoordinationResult}
                name="CoordinationResult"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={Circle}
                name="Circle"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={StrengthScreen}
                name="StrengthScreen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={ViewResultsScreen}
                name="ViewResultsScreen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={RadarResultScreen}
                name="RadarResultScreen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={LineResultScreen}
                name="LineResultScreen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={LoadingScreen}
                name="LoadingScreen"
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </themeContext.Provider>
      </AppContext.Provider>
    );
  } else {
    //error handling - throws exception
    <AppLoading />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
