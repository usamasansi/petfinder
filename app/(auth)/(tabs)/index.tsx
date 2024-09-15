import { useAuthStore } from "@/store/authStore";
import Container from "@/components/Container";
import { Stack } from "expo-router";
import { ExploreHeader } from "@/components/ExploreHeader";
import { useState } from "react";
import Listings from "@/components/Listings";
import ListingsMap from "@/components/ListingsMap";
import listingsDataGeo from "@/assets/mock-data/listings-on-map.geo.json";

export default function HomeScreen() {
  const onLogout = useAuthStore((state) => state.onLogout);

  const [category, setCategory] = useState("Cat");

  const onDataChanged = (category: string) => {
    setCategory(category);
  };
  return (
    <>
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
        }}
      />
      {/* <Listings listings={[]} category={category} /> */}
      <ListingsMap listings={listingsDataGeo} />
    </>
  );
}
