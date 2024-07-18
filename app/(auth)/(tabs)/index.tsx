import { Image, StyleSheet, Platform } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuthStore } from "@/store/authStore";
import { Button } from "react-native-paper";
import Container from "@/components/Container";
import { Stack } from "expo-router";
import { ExploreHeader } from "@/components/ExploreHeader";

export default function HomeScreen() {
  const onLogout = useAuthStore((state) => state.onLogout);
  return (
    <Container withHeader>
      <Stack.Screen
        options={{
          header: () => <ExploreHeader />,
        }}
      />
      <ThemedText>Listings</ThemedText>
    </Container>
  );
}
