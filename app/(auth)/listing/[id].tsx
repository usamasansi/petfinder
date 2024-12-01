import { Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import Animated, {
  interpolate,
  SlideInDown,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { Listings } from "@/components/Listings";
import listingsData from "@/assets/mock-data/listings-on-map.json";
import { ThemedView } from "@/components/ThemedView";
import { Avatar, Button, Icon, IconButton, Text } from "react-native-paper";
import Divider from "@/components/Divider";
import { FOOTER_HEIGHT, useDefaultStyles } from "@/constants/Styles";
import { useTranslation } from "react-i18next";

const IMG_HEIGHT = 300;
const { width } = Dimensions.get("window");

const Page = () => {
  const defaultStyles = useDefaultStyles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const listing: Listings = (listingsData as any[]).find(
    (item) => item.id === id
  );

  const { t } = useTranslation();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const scrollOffset = useScrollViewOffset(scrollRef);

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: FOOTER_HEIGHT }}
        ref={scrollRef}
        scrollEventThrottle={16}
      >
        <Animated.Image
          source={{ uri: listing.xl_picture_url }}
          style={[styles.image, animatedImageStyle]}
          resizeMode="cover"
        />
        <View style={[defaultStyles.content, styles.infoContainer]}>
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
          <Text variant="bodyMedium" style={{ textAlign: "justify" }}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. A minima
            eaque odit sint aspernatur asperiores mollitia, quos dolores impedit
            ipsam amet tempore esse nisi aut laborum similique illo, eligendi
            deserunt? Neque culpa est temporibus maxime corporis. Molestiae
            expedita natus praesentium assumenda explicabo illum excepturi
            maiores ipsum veritatis sed quas, quam libero dolorum illo vel
            atque, sunt fuga, nemo quaerat voluptatem? Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Ipsam nesciunt et in. Explicabo
            numquam sit, perspiciatis corporis laboriosam, obcaecati vel
            voluptate sunt earum quasi nihil! Cumque repellendus sed nesciunt
            culpa.
          </Text>
        </View>
      </Animated.ScrollView>
      <Animated.View
        style={defaultStyles.footer}
        entering={SlideInDown.delay(200)}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text variant="labelLarge" style={{ flexShrink: 1 }}>
            {t("listingSlugFooterText")}
          </Text>
          <Button
            mode="outlined"
            onPress={() => console.log("adding listing to a favourite")}
          >
            {t("saveForLater")}
          </Button>
        </View>
      </Animated.View>
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
  },
  infoContainer: {
    padding: 24,
  },
  name: {},
  location: { marginTop: 10, flexDirection: "row", gap: 4 },
  addedBy: {
    flexDirection: "row",
    gap: 18,
    alignItems: "center",
  },
});

export default Page;
