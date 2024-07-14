import {
  Material3Scheme,
  Material3Theme,
  useMaterial3Theme,
} from "@pchmn/expo-material3-theme";
import { createContext, useContext } from "react";
import { useColorScheme } from "react-native";
import {
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
  Provider as PaperProvider,
  ProviderProps,
  useTheme,
} from "react-native-paper";

type Material3ThemeProviderProps = {
  theme: Material3Theme;
  updateTheme: (sourceColor: string) => void;
  resetTheme: () => void;
};

const Material3ThemeProviderContext =
  createContext<Material3ThemeProviderProps>({} as Material3ThemeProviderProps);

export function Material3ThemeProvider({
  children,
  sourceColor,
  fallbackSourceColor,
  ...otherProps
}: ProviderProps & { sourceColor?: string; fallbackSourceColor?: string }) {
  const colorScheme = useColorScheme();

  const { theme, updateTheme, resetTheme } = useMaterial3Theme({
    sourceColor,
    fallbackSourceColor,
  });

  const myLightColors = {
    primary: "rgb(75, 87, 169)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(223, 224, 255)",
    onPrimaryContainer: "rgb(0, 14, 95)",
    secondary: "rgb(91, 93, 114)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(224, 225, 249)",
    onSecondaryContainer: "rgb(24, 26, 44)",
    tertiary: "rgb(119, 83, 108)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(255, 215, 240)",
    onTertiaryContainer: "rgb(45, 18, 39)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(255, 251, 255)",
    onBackground: "rgb(27, 27, 31)",
    surface: "rgb(255, 251, 255)",
    onSurface: "rgb(27, 27, 31)",
    surfaceVariant: "rgb(227, 225, 236)",
    onSurfaceVariant: "rgb(70, 70, 79)",
    outline: "rgb(118, 118, 128)",
    outlineVariant: "rgb(199, 197, 208)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(48, 48, 52)",
    inverseOnSurface: "rgb(243, 240, 244)",
    inversePrimary: "rgb(187, 195, 255)",
    elevation: {
      level0: "transparent",
      level1: "rgb(246, 243, 251)",
      level2: "rgb(241, 238, 248)",
      level3: "rgb(235, 233, 246)",
      level4: "rgb(233, 231, 245)",
      level5: "rgb(230, 228, 243)",
    },
    surfaceDisabled: "rgba(27, 27, 31, 0.12)",
    onSurfaceDisabled: "rgba(27, 27, 31, 0.38)",
    backdrop: "rgba(47, 48, 56, 0.4)",
  };

  const myDarkColors = {
    primary: "rgb(187, 195, 255)",
    onPrimary: "rgb(25, 38, 120)",
    primaryContainer: "rgb(50, 63, 144)",
    onPrimaryContainer: "rgb(223, 224, 255)",
    secondary: "rgb(196, 197, 221)",
    onSecondary: "rgb(45, 47, 66)",
    secondaryContainer: "rgb(67, 69, 89)",
    onSecondaryContainer: "rgb(224, 225, 249)",
    tertiary: "rgb(230, 186, 215)",
    onTertiary: "rgb(69, 38, 61)",
    tertiaryContainer: "rgb(93, 60, 84)",
    onTertiaryContainer: "rgb(255, 215, 240)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(27, 27, 31)",
    onBackground: "rgb(228, 225, 230)",
    surface: "rgb(27, 27, 31)",
    onSurface: "rgb(228, 225, 230)",
    surfaceVariant: "rgb(70, 70, 79)",
    onSurfaceVariant: "rgb(199, 197, 208)",
    outline: "rgb(144, 144, 154)",
    outlineVariant: "rgb(70, 70, 79)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(228, 225, 230)",
    inverseOnSurface: "rgb(48, 48, 52)",
    inversePrimary: "rgb(75, 87, 169)",
    elevation: {
      level0: "transparent",
      level1: "rgb(35, 35, 42)",
      level2: "rgb(40, 40, 49)",
      level3: "rgb(45, 46, 56)",
      level4: "rgb(46, 47, 58)",
      level5: "rgb(49, 51, 62)",
    },
    surfaceDisabled: "rgba(228, 225, 230, 0.12)",
    onSurfaceDisabled: "rgba(228, 225, 230, 0.38)",
    backdrop: "rgba(47, 48, 56, 0.4)",
  };

  const paperTheme =
    colorScheme === "dark"
      ? { ...MD3DarkTheme, colors: myDarkColors }
      : { ...MD3LightTheme, colors: myLightColors };

  return (
    <Material3ThemeProviderContext.Provider
      value={{ theme, updateTheme, resetTheme }}
    >
      <PaperProvider theme={paperTheme} {...otherProps}>
        {children}
      </PaperProvider>
    </Material3ThemeProviderContext.Provider>
  );
}

export function useMaterial3ThemeContext() {
  const ctx = useContext(Material3ThemeProviderContext);
  if (!ctx) {
    throw new Error(
      "useMaterial3ThemeContext must be used inside Material3ThemeProvider"
    );
  }
  return ctx;
}

export const useAppTheme = useTheme<MD3Theme & { colors: Material3Scheme }>;
