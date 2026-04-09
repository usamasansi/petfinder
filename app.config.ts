import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "lost-pet-finder-app",
  slug: "lost-pet-finder-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.belkocik.lostpetfinder",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.belkocik.lostpetfinder",
    softwareKeyboardLayoutMode: "pan",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-localization",
      {
        locationAlwaysAndWhenInUsePermission:
          "Allow $(PRODUCT_NAME) to use your location.",
      },
    ],
    "expo-secure-store",
    "expo-font",
  ],
  experiments: {
    typedRoutes: true,
  },
  newArchEnabled: true,

  // ✅ THIS IS THE REQUIRED BLOCK FOR EAS
  extra: {
    ...config.extra,
    eas: {
      projectId: "67c2a956-49a8-42e7-a6d8-f5a88cdbd610",
    },
  },
});
