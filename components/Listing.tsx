import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Pet interface
interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: string;
  image: any; // Support both require and uri formats
}

interface ListingsProps {
  listings: Pet[];
  category: string;
}

const Listings: React.FC<ListingsProps> = ({ listings, category }) => {
  const colorScheme = useColorScheme();
  
  useEffect(() => {
    // Debug all listings on component mount
    console.log('All listings:', listings);
    console.log('Initial category:', category);
  }, []);

  // Filter listings by category (pet type) - make it case insensitive
  const filteredListings = category === 'All' 
    ? listings 
    : listings.filter(
        (listing) => listing.type.toLowerCase() === category.toLowerCase()
      );
  
  console.log('Filtered listings:', filteredListings);
  console.log('Current category:', category);

  if (!listings || listings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].text }]}>
          No pets available.
        </Text>
      </View>
    );
  }

  if (filteredListings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].text }]}>
          No pets found in the {category} category.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Pet }) => {
    console.log('Rendering item:', item.name, 'Type:', item.type);
    
    return (
      <Link href={`/pet/${item.id}` as any} asChild>
        <TouchableOpacity
          style={[
            styles.card,
            { backgroundColor: Colors[colorScheme ?? 'light'].background }
          ]}
          activeOpacity={0.8}
        >
          <View style={styles.imageContainer}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="cover"
              onError={(error) => console.error(`Image error for ${item.name}:`, error.nativeEvent.error)}
              onLoad={() => console.log(`Image loaded for ${item.name}`)}
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={[styles.name, { color: Colors[colorScheme ?? 'light'].text }]}>
              {item.name}
            </Text>
            <Text style={[styles.type, { color: Colors[colorScheme ?? 'light'].tint }]}>
              {item.type}
            </Text>
            <Text style={[styles.details, { color: Colors[colorScheme ?? 'light'].text }]}>
              {item.breed} • {item.age}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.categoryTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
        {category === 'All' ? 'All Pets' : `${category}s`} ({filteredListings.length})
      </Text>
      <FlatList
        data={filteredListings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />} // Add vertical spacing
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 4, // Add horizontal padding to the list
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    width: '40%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 0, // Remove bottom margin from card, spacing is handled by ItemSeparator
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    height: 150,
    backgroundColor: '#f0f0f0', // Placeholder color while image loads
    
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  type: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default Listings;
