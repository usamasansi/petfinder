import * as Updates from "expo-updates";
import { API_BASE_URL } from "@/constants/Config";
import axios from "axios";
import {
  deleteValueFromSecureStore,
  getValueFromSecureStoreFor,
  saveItemInSecureStore,
} from "../utils";
import { Alert } from "react-native";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    const accessTokenFromSecureStore = await getValueFromSecureStoreFor(
      "access_token"
    );
    if (accessTokenFromSecureStore) {
      config.headers.Authorization = `Bearer ${accessTokenFromSecureStore}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log("response", response);
    return response;
  },
  async (error) => {
    console.log("error", error);
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      console.log("call the refresh token api here");

      try {
        const refreshTokenFromSecureStore = await getValueFromSecureStoreFor(
          "refresh_token"
        );
        const response = await api.post("/api/auth/refresh", {
          refreshTokenFromSecureStore,
        });
        const { accessToken, refreshToken } = response.data;

        await saveItemInSecureStore("access_token", accessToken);
        await saveItemInSecureStore("refresh_token", refreshToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (error) {
        // Handle refresh token error or redirect to login
        // TODO: navigate to login page -> test

        //* You can remove the token from storage if you get 401, and use reloadAsync() from expo-updates. The app will automatically redirect the user to the login page. Otherwise, make it a custom took so you have access to the Expo Router.
        deleteValueFromSecureStore("access_token");
        deleteValueFromSecureStore("refresh_token");
        // todo: check how make a custom expo-router hook to navigate to login screen
        // await NavigationService.navigate("Login");

        //! expo-updates reloadAsync
        await Updates.reloadAsync();

        //* You can also show a message to the user
        Alert.alert("Error", "Please login again.");

        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
