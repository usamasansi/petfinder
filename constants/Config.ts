// todo: load config from env

import { Platform } from "react-native";

// if you don't run your app in expo go, but in generated APK in Android -> change localhost to: your pc ip or 10.0.2.2
export const API_BASE_URL = `http://${
  Platform.OS === "android" ? "10.0.2.2" : "localhost"
}:3333/api`;
