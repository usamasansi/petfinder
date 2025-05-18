import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Material3ThemeProvider } from "@/lib/theme/Material3ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toasts } from "@backpackapp-io/react-native-toast";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "@/i18n";
import { Colors } from "@/constants/Colors";

const queryClient = new QueryClient();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Lobster: require("../assets/fonts/Lobster-Regular.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <Material3ThemeProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <Stack
                screenOptions={{
                  headerTitleAlign: "center",
                  navigationBarColor:
                    colorScheme === "dark"
                      ? Colors["dark"].background
                      : Colors["light"].background,
                  statusBarBackgroundColor:
                    colorScheme === "dark"
                      ? Colors["dark"].background
                      : Colors["light"].background,
                  headerTintColor:
                    colorScheme === "dark"
                      ? Colors["dark"].text
                      : Colors["light"].text,
                  headerStyle: {
                    backgroundColor:
                      colorScheme === "dark"
                        ? Colors["dark"].background
                        : Colors["light"].background,
                  },
                }}
              >
                <Stack.Screen
                  name="(auth)/(tabs)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="(auth)/listing/[id]"
                  options={{
                    headerTitle: "",
                    headerBackButtonDisplayMode: "minimal",
                    headerTransparent: true,
                  }}
                />
                <Stack.Screen
                  name="(public)/login"
                  options={{
                    headerShown: true,
                    title: "Login",
                  }}
                />
                 <Stack.Screen
                  name="(public)/signin"
                  options={{
                    headerShown: true,
                    title: "Sign In",
                  }}
                />
                <Stack.Screen name="+not-found" />
              </Stack>
              <Toasts />
            </ThemeProvider>
          </Material3ThemeProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
