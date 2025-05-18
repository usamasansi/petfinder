import React from 'react';
import { SafeAreaView, Text, FlatList, StyleSheet, View } from 'react-native';
import PetListItem from '../../../components/PetListItem';
import { Colors } from '../../../constants/Colors'; // adjust path if needed

// Define the Pet type locally since it's not exported from PetListItem
type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  image: string | null;
  status: string;
};

// Dummy data for demonstration (5 pets) with real placeholder image links
const dummyPets: Pet[] = [
  {
    id: '1',
    name: 'Max',
    species: 'Dog',
    breed: 'Labrador',
    image: 'https://placedog.net/500/500?id=1',
    status: 'lost',
  },
  {
    id: '2',
    name: 'Luna',
    species: 'Cat',
    breed: 'Persian',
    image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=500&q=60',
    status: 'found',
  },
  {
    id: '3',
    name: 'Buddy',
    species: 'Dog',
    breed: 'Golden Retriever',
    image: 'https://placedog.net/500/500?id=3',
    status: 'lost',
  },
  {
    id: '4',
    name: 'Charlie',
    species: 'Dog',
    breed: 'Beagle',
    image: 'https://placedog.net/500/500?id=4',
    status: 'lost',
  },
  {
    id: '5',
    name: 'Molly',
    species: 'Cat',
    breed: 'Siamese',
    image: 'https://images.pexels.com/photos/162174/cat-british-shorthair-mieze-blue-eye-162174.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    status: 'found',
  },
];

const PetListScreen = () => {
  const handlePetPress = (pet: Pet) => {
    // TODO: Navigate to pet details screen or show modal
    console.log('Selected pet:', pet);
  };

  return (
    <SafeAreaView style={styles.container}>
     
      <FlatList
        data={dummyPets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PetListItem pet={item} onPress={handlePetPress} theme="dark" />
        )}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No pets listed yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: Colors.dark.text,
  },
  list: {
    backgroundColor: '#000000', // full black background for list
  },
  listContent: {
    paddingVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.dark.text,
  },
});

export default PetListScreen;