import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import React from "react";

import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HelpScreen from "../screens/HelpScreen";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

//bottom bar tab icons
import Ionicons from "react-native-vector-icons/Ionicons";

// The bottom bar tab navigator exists on most screens and allows the user to navigate between the home, help and settings screens

const Tab = createMaterialBottomTabNavigator();

//needed if in app.js?
const TabNavigator = () => {
  return (
    //customisations to bottom bar navigation
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="white"
      inactiveColor="#3e2465"
      shifting="true"
      barStyle={{ backgroundColor: "#8BBCCC" }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarColor: "#8BBCCC",
          tabBarIcon: ({ color, size, tabBarShowLabel }) => (
            <Ionicons name="home-outline" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Help"
        component={HelpScreen}
        options={{
          tabBarColor: "#7895B2",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-help-circle-outline" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={SettingsScreen}
        options={{
          tabBarColor: "#5A8F7B",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
