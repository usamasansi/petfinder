import { View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native-paper";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  console.log("🚀 ~ Page ~ id:", id);
  return (
    <View>
      <Text>Page: {id}</Text>
    </View>
  );
};

export default Page;
