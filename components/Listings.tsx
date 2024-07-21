import { View } from "react-native";
import React, { useEffect } from "react";
import { Text } from "react-native-paper";

type Props = {
  listings: any[];
  category: string;
};

export default function Listings({ listings, category }: Props) {
  useEffect(() => {
    console.log("RELOAD LISTING");
  }, [category]);

  return (
    <View>
      <Text>Listings</Text>
    </View>
  );
}
