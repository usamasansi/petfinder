import { Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import Animated from "react-native-reanimated";
import { Listings } from "@/components/Listings";
import listingsData from "@/assets/mock-data/listings-on-map.json";
import { ThemedView } from "@/components/ThemedView";
import { Avatar, Icon, IconButton, Text } from "react-native-paper";
import Divider from "@/components/Divider";

const IMG_HEIGHT = 300;
const { width } = Dimensions.get("window");

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const listing: Listings = (listingsData as any[]).find(
    (item) => item.id === id
  );
  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView>
        <Animated.Image
          source={{ uri: listing.xl_picture_url }}
          style={styles.image}
        />
        <View style={styles.infoContainer}>
          <View style={styles.name}>
            <Text variant="headlineLarge">Saw a dog near grocery shop!</Text>
          </View>
          <View style={styles.location}>
            <Icon source="google-maps" size={20} />
            <Text variant="labelLarge">Mickiewicza 74, 35-322 Rzeszów </Text>
          </View>
          <View style={styles.location}>
            <Icon source="dog" size={20} />
            <Text variant="labelLarge">Dalmatian</Text>
          </View>
          <Divider />
          <View style={styles.addedBy}>
            <Avatar.Text size={58} label="JO" />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                flex: 1,
              }}
            >
              <View>
                <Text variant="labelLarge" style={{ fontWeight: "bold" }}>
                  JohnySmolini
                </Text>
                <Text variant="labelLarge">Created at 06-10-2024</Text>
              </View>
              <IconButton
                icon="chat"
                size={20}
                onPress={() =>
                  console.log("Navigate to chat to create a message to an user")
                }
              />
            </View>
          </View>
          <Divider />
        </View>
      </Animated.ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width,
    height: IMG_HEIGHT,
    resizeMode: "cover",
  },
  infoContainer: { flex: 1, padding: 24 },
  name: {},
  location: { marginTop: 10, flexDirection: "row", gap: 4 },
  addedBy: {
    flexDirection: "row",
    gap: 18,
    alignItems: "center",
  },
});

export default Page;
