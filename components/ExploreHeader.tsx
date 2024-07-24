import {
  Platform,
  SafeAreaView,
  ScrollView,
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
    name: "Pound",
    icon: "home-roof",
  },
  {
    id: 3,
    name: "Other",
    icon: "ab-testing",
  },
  {
    id: 4,
    name: "Other",
    icon: "ab-testing",
  },
  {
    id: 5,
    name: "Other",
    icon: "ab-testing",
  },
  {
    id: 6,
    name: "Other",
    icon: "ab-testing",
  },
  {
    id: 7,
    name: "Other",
    icon: "ab-testing",
  },
  {
    id: 8,
    name: "Other",
    icon: "ab-testing",
  },
  {
    id: 9,
    name: "Other",
    icon: "ab-testing",
  },
  {
    id: 10,
    name: "Other",
    icon: "ab-testing",
  },
  {
    id: 11,
    name: "Other",
    icon: "ab-testing",
  },
];

type Props = {
  onCategoryChanged: (category: string) => void;
};

export function ExploreHeader({ onCategoryChanged }: Props) {
  const theme = useAppTheme();
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState(1);

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    selected?.measure((x) => {
      scrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true });
    });
    setActiveIndex(index);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].name);
  };

  return (
    <ThemedView>
      <SafeAreaView
        style={{
          paddingTop: Platform.OS === "android" ? 28 : 0,
        }}
      >
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
                  <Text style={{ color: theme.colors.secondary, fontSize: 13 }}>
                    To my pet · at any time
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
            <IconButton
              icon={({ color }) => (
                <Ionicons name="options-outline" color={color} size={24} />
              )}
              mode="outlined"
              size={28}
              onPress={() => console.log("Pressed")}
            />
          </View>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: "center",
              gap: 30,
              paddingHorizontal: 16,
            }}
          >
            {categories.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  ref={(element) => (itemsRef.current[index] = element)}
                  onPress={() => selectCategory(index)}
                  style={
                    activeIndex === index
                      ? {
                          ...styles.categoriesBtnActive,
                          borderBottomColor: theme.colors.primary,
                        }
                      : styles.categoriesBtn
                  }
                >
                  <Icon
                    source={item.icon}
                    size={24}
                    color={
                      activeIndex === index ? theme.colors.primary : undefined
                    }
                  />
                  <Text
                    variant="labelLarge"
                    style={{
                      color:
                        activeIndex === index
                          ? theme.colors.primary
                          : theme.colors.onSurface,
                      fontWeight: "600",
                    }}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
