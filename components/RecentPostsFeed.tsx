import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const recentPosts = [
  {
    id: '1',
    type: 'lost',
    name: 'Milo',
    location: 'Downtown LA',
    image: 'https://placedog.net/400?id=1',
  },
  {
    id: '2',
    type: 'found',
    name: 'Unknown Cat',
    location: 'Pasadena',
    image: 'https://placekitten.com/400/300',
  },
  {
    id: '3',
    type: 'adopted',
    name: 'Buddy',
    location: 'Santa Monica',
    image: 'https://placedog.net/400?id=2',
  },
];

const RecentPostsFeed = () => {
  return (
    <FlatList
      horizontal
      data={recentPosts}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.feed}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.meta}>
            <Ionicons
              name={
                item.type === 'lost'
                  ? 'alert-circle'
                  : item.type === 'found'
                  ? 'search'
                  : 'heart'
              }
              size={16}
              color="#888"
            />
            <Text style={styles.location}> {item.location}</Text>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  feed: {
    paddingHorizontal: 8,
  },
  card: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: 100,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingTop: 6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  location: {
    fontSize: 12,
    color: '#666',
  },
});

export default RecentPostsFeed;
