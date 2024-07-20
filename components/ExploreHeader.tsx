import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon, IconButton, Text } from "react-native-paper";
import { Link } from "expo-router";
import { useAppTheme } from "@/lib/theme/Material3ThemeProvider";
import { Ionicons } from "@expo/vector-icons";

export function ExploreHeader() {
  const theme = useAppTheme();
  return (
    <ThemedView>
      <SafeAreaView>
        <View style={styles.container}>
          <View style={styles.actionRow}>
            <Link
              style={{ color: "red" }}
              href={"/(auth)/(tabs)/explore"}
              asChild
            >
              <TouchableOpacity
                style={{
                  ...styles.searchBtn,
                  borderColor: theme.colors.secondary,
                  backgroundColor: theme.colors.background,
                  shadowColor: theme.colors.onBackground,
                }}
              >
                <Icon size={24} source="magnify" />
                <View>
                  <Text style={{ fontWeight: "600" }}>Where to?</Text>
                  <Text style={{ color: theme.colors.secondary }}>
                    Anywhere · Any week
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
            <IconButton
              icon={({ color, size }) => (
                <Ionicons name="options-outline" color={color} size={size} />
              )}
              mode="outlined"
              size={28}
              onPress={() => console.log("Pressed")}
            />
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {},
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 10,
  },
  searchBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 2,
    flex: 1,
    padding: 14,
    borderRadius: 30,

    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
});
