import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { useAuthStore } from "@/store/authStore";
import { useCheckAuthenticated } from "@/hooks/useCheckAuthenticated";
import { Button, Surface, Text, TextInput } from "react-native-paper";
import { View } from "react-native";
import Container from "@/components/Container";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Image } from "expo-image";
import { Images } from "@/assets/images";

export default function Login() {
  const { authenticated } = useAuthStore((state) => state.authState);
  const [text, setText] = React.useState("");

  useCheckAuthenticated(authenticated);
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <Container withHeader>
      <Animated.View
        entering={FadeIn.duration(250)}
        exiting={FadeOut.duration(250)}
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Image
          style={{ width: 150, height: 150 }}
          source={Images.LogoImage}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
        <Text
          variant="headlineLarge"
          style={{
            textAlign: "center",
            marginBottom: 10,
            fontFamily: "Lobster",
          }}
        >
          LostPetFinder
        </Text>
      </Animated.View>
      <Animated.View
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(500)}
        style={{ marginBottom: 10 }}
      >
        <TextInput
          label="Email"
          value={text}
          onChangeText={(text) => setText(text)}
          mode="outlined"
        />
      </Animated.View>
      <Animated.View
        entering={FadeIn.duration(750)}
        exiting={FadeOut.duration(750)}
        style={{ marginBottom: 10 }}
      >
        <TextInput
          label="Password"
          value={text}
          onChangeText={(text) => setText(text)}
          mode="outlined"
        />
      </Animated.View>
      <Animated.View
        entering={FadeIn.duration(850)}
        exiting={FadeOut.duration(850)}
        style={{ marginBottom: 10, alignSelf: "center" }}
      >
        <Button mode="outlined" onPress={() => console.log("Pressed")}>
          Submit
        </Button>
      </Animated.View>
    </Container>
  );
}
