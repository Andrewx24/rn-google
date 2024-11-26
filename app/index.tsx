import React, { useEffect } from "react";
import { Text, View, Button, Alert } from "react-native";
import {
  GoogleOneTapSignIn,
  statusCodes,
  isErrorWithCode,
  isSuccessResponse,
  isNoSavedCredentialFoundResponse,
} from "@react-native-google-signin/google-signin";

const signIn = async () => {
  try {
    // Check Play Services (Android only)
    await GoogleOneTapSignIn.checkPlayServices();

    const response = await GoogleOneTapSignIn.signIn();

    if (isSuccessResponse(response)) {
      console.log("User Info: ", response.data);
      Alert.alert("Sign-In Success", `Welcome, ${response.data.givenName}`);
    } else if (isNoSavedCredentialFoundResponse(response)) {
      console.warn("No saved credentials found.");
      Alert.alert("No Credentials", "Please sign in manually.");
    }
  } catch (error) {
    console.error("Google Sign-In Error: ", error);
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.ONE_TAP_START_FAILED:
          console.warn("One-tap start failed. Try explicit sign-in.");
          Alert.alert("Error", "One-tap sign-in failed.");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.error("Google Play Services not available.");
          Alert.alert("Error", "Google Play Services are not available.");
          break;
        default:
          console.error("Unhandled error: ", error);
          Alert.alert("Error", "An unknown error occurred.");
      }
    } else {
      console.error("Non-Google Sign-In error: ", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  }
};

export default function Index() {
  useEffect(() => {
    GoogleOneTapSignIn.configure({
      webClientId: "your_web_client_id.apps.googleusercontent.com",
      iosClientId: "767466950068-9h21tk300nm67tpc6hg6d6t27cr9f7pi.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Sign in with Google</Text>
      <Button title="Sign In" onPress={signIn} />
    </View>
  );
}

