import { useAuthStore } from "@/store/authStore";
import { Stack } from "expo-router";
import { ExploreHeader } from "@/components/ExploreHeader";
import { useMemo, useState } from "react";
import Listings from "@/components/Listings";
import ListingsMap from "@/components/ListingsMap";
// import listingsDataGeo from "@/assets/mock-data/listings-on-map.geo.json";
import listingsData from "@/assets/mock-data/listings-on-map.json";

export default function HomeScreen() {
  const onLogout = useAuthStore((state) => state.onLogout);

  const [category, setCategory] = useState("Cat");

  const getoItems = useMemo(() => listingsData, []);

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
      <Listings listings={getoItems} category={category} />
      {/* <ListingsMap listings={listingsDataGeo} /> */}
    </>
  );
}
