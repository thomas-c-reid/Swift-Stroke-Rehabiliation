import React, { useContext } from "react";
import {
  Image,
  ImageBackground,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import themeContext from "../config/themeContext";
import AntDesign from "react-native-vector-icons/AntDesign";

// The coming soon screen is shown to the user whenever a section of the app has not been implemented yet

function ComingSoonScreen({ navigation }) {
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
      </View>
      <Text style={[styles.titleText, { color: theme.color }]}>
        COMING SOON...
      </Text>
      <Text style={[styles.regularText, { color: theme.color }]}>
        Stay tuned for more info!
      </Text>

      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="back" size={45} color={theme.color} />
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
        top: -Dimensions.get("window").height * 0.44,
      },
      android: {
        top: -Dimensions.get("window").height * 0.52,
      },
    }),
  },
  goBackButton: {
    width: 55,
    height: 55,
    top: 50,
    //padding: 10,
    //backgroundColor: "pink",
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
    color: "#383838",
  },
  regularText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 17,
    textAlign: "center",
  },
});

export default ComingSoonScreen;
