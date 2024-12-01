import { StyleSheet, useColorScheme } from "react-native";
import { Colors } from "./Colors";

export const useDefaultStyles = () => {
  const colorScheme = useColorScheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme ?? "light"]?.background,
    },
    footer: {
      position: "absolute",
      height: 100,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: Colors[colorScheme ?? "light"]?.background,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderTopColor: Colors[colorScheme ?? "light"]?.border,
      borderTopWidth: StyleSheet.hairlineWidth,
    },
  });
};
