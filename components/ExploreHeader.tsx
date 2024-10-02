import {
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { ThemedView } from "./ThemedView";
import { Icon, IconButton, Text } from "react-native-paper";
import { Link } from "expo-router";
import { useAppTheme } from "@/lib/theme/Material3ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";

const categories = [
  {
    id: 1,
    name: "Dog",
    icon: "dog",
  },
  {
    id: 2,
    name: "Cat",
    icon: "cat",
  },
  {
    id: 3,
    name: "Rabbit",
    icon: "ab-testing",
  },
  {
    id: 4,
    name: "Horse",
    icon: "ab-testing",
  },
  {
    id: 5,
    name: "Bird",
    icon: "ab-testing",
  },
  {
    id: 6,
    name: "Other",
    icon: "ab-testing",
  },
  {
    id: 7,
    name: "Other2",
    icon: "ab-testing",
  },
  {
    id: 8,
    name: "Other3",
    icon: "ab-testing",
  },
];

type Props = {
  onCategoryChanged: (category: string) => void;
};

const SPACING = 10;

export function ExploreHeader({ onCategoryChanged }: Props) {
  const theme = useAppTheme();

  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectCategory = (index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewOffset: SPACING,
      viewPosition: 0.5,
    });
    setActiveIndex(index);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].name);
  };

  return (
    <ThemedView>
      <SafeAreaView edges={["left", "top", "right"]}>
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
                }}
                onPress={() =>
                  console.log(
                    "todo: go to modal view where you can hit a google location api"
                  )
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                    marginLeft: 16,
                  }}
                >
                  <Icon size={24} source="magnify" />
                  <View>
                    <Text style={{ fontWeight: "600" }}>Search</Text>
                    <Text
                      style={{ color: theme.colors.secondary, fontSize: 13 }}
                    >
                      Places · Locations
                    </Text>
                  </View>
                </View>
                <IconButton
                  icon={({ color }) => (
                    <Ionicons name="options-outline" color={color} size={24} />
                  )}
                  size={24}
                  onPress={() => console.log("Pressed")}
                />
              </TouchableOpacity>
            </Link>
          </View>
          <FlatList
            ref={flatListRef}
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={activeIndex}
            style={{ flexGrow: 0 }}
            contentContainerStyle={{
              gap: 30,
              paddingHorizontal: 16,
              paddingBottom: Platform.OS === "android" ? 10 : 0,
            }}
            data={categories}
            keyExtractor={(item) => item.name}
            horizontal
            renderItem={({ item, index: fIndex }) => {
              return (
                <TouchableOpacity
                  onPress={() => selectCategory(fIndex)}
                  style={
                    activeIndex === fIndex
                      ? {
                          ...styles.categoriesBtnActive,
                          borderBottomColor: theme.colors.primary,
                        }
                      : styles.categoriesBtn
                  }
                >
                  <MotiView
                    animate={{
                      opacity: activeIndex === fIndex ? 1 : 0.6,
                    }}
                    transition={{ duration: 300 }}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon
                      source={item.icon}
                      size={24}
                      color={
                        activeIndex === fIndex
                          ? theme.colors.primary
                          : undefined
                      }
                    />
                    <Text
                      variant="labelLarge"
                      style={{
                        color:
                          activeIndex === fIndex
                            ? theme.colors.primary
                            : theme.colors.onSurface,
                        fontWeight: "600",
                      }}
                    >
                      {item.name}
                    </Text>
                  </MotiView>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Platform.OS === "android" ? 0 : 10,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  searchBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    justifyContent: "space-between",
    borderRadius: 24,
  },
  categoriesBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
  },
  categoriesBtnActive: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
    borderBottomWidth: 2,
  },
});
