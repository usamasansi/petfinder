import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Icon, Text } from "react-native-paper";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

type Props = {
  listings: any;
  category: string;
};

export default function Listings({ listings: items, category }: Props) {
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);
  useEffect(() => {
    console.log("RELOAD LISTING");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [category]);

  const renderRow: ListRenderItem<Listings> = ({ item }) => {
    return (
      <Link href={`/(auth)/listing/${item.id}`} asChild>
        <TouchableOpacity>
          <Animated.View
            style={styles.listing}
            entering={FadeInRight}
            exiting={FadeOutLeft}
          >
            <Image source={{ uri: item.medium_url }} style={styles.image} />
            <TouchableOpacity
              style={{ position: "absolute", right: 30, top: 30 }}
            >
              <Ionicons name="heart-outline" size={24} color="black" />
            </TouchableOpacity>
            <View style={{ flexDirection: "column" }}>
              <Text variant="titleMedium">{item.name}</Text>
              <Text variant="titleSmall">Location</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Text>Listings</Text> */}
      <FlatList
        ref={listRef}
        data={loading ? [] : items}
        renderItem={renderRow}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listing: {
    padding: 16,
    marginVertical: 16,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
});
interface Listings {
  id: string;
  listing_url: string;
  scrape_id: string;
  last_scraped: string;
  name: string;
  summary: undefined | string;
  space: undefined | string;
  description: string;
  experiences_offered: string;
  neighborhood_overview: undefined | string;
  notes: undefined | string;
  transit: undefined | string;
  access: undefined | string;
  interaction: undefined | string;
  house_rules: undefined | string;
  thumbnail_url: undefined | string;
  medium_url: undefined | string;
  picture_url: Pictureurl | undefined;
  xl_picture_url: undefined | string;
  host_id: string;
  host_url: string;
  host_name: string;
  host_since: string;
  host_location: undefined | string;
  host_about: undefined | string;
  host_response_time: string;
  host_response_rate: number;
  host_acceptance_rate: undefined;
  host_thumbnail_url: string;
  host_picture_url: string;
  host_neighbourhood: undefined | string;
  host_listings_count: number;
  host_total_listings_count: number;
  host_verifications: string[];
  street: string;
  neighbourhood: undefined | string;
  neighbourhood_cleansed: string;
  neighbourhood_group_cleansed: string;
  city: string;
  state: undefined | string;
  zipcode: undefined | string;
  market: undefined | string;
  smart_location: string;
  country_code: string;
  country: string;
  latitude: string;
  longitude: string;
  property_type: string;
  room_type: string;
  accommodates: number;
  bathrooms: undefined | number;
  bedrooms: undefined | number;
  beds: number;
  bed_type: string;
  amenities: string[];
  square_feet: undefined | number;
  price: number;
  weekly_price: undefined | number;
  monthly_price: undefined | number;
  security_deposit: undefined | number;
  cleaning_fee: undefined | number;
  guests_included: number;
  extra_people: number;
  minimum_nights: number;
  maximum_nights: number;
  calendar_updated: string;
  has_availability: undefined;
  availability_30: number;
  availability_60: number;
  availability_90: number;
  availability_365: number;
  calendar_last_scraped: string;
  number_of_reviews: number;
  first_review: undefined | string;
  last_review: undefined | string;
  review_scores_rating: undefined | number;
  review_scores_accuracy: undefined | number;
  review_scores_cleanliness: undefined | number;
  review_scores_checkin: undefined | number;
  review_scores_communication: undefined | number;
  review_scores_location: undefined | number;
  review_scores_value: undefined | number;
  license: undefined;
  jurisdiction_names: undefined;
  cancellation_policy: string;
  calculated_host_listings_count: number;
  reviews_per_month: undefined | number;
  geolocation: Geolocation;
  features: string[];
}

interface Geolocation {
  lon: number;
  lat: number;
}

interface Pictureurl {
  thumbnail: boolean;
  filename: string;
  format: string;
  width: number;
  mimetype: string;
  etag: string;
  id: string;
  last_synchronized: string;
  color_summary: string[];
  height: number;
}
