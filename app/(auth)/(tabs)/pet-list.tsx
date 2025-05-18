import React from 'react';
import { SafeAreaView, Text, FlatList, StyleSheet, View } from 'react-native';
import PetListItem from '../../../components/PetListItem';

// Define the Pet type locally since it's not exported from PetListItem
type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  image: string | null;
  status: string;
};

// Dummy data for demonstration
const dummyPets: Pet[] = [
  {
    id: '1',
    name: 'Max',
    species: 'Dog',
    breed: 'Labrador',
    image: 'https://example.com/max.jpg',
    status: 'lost',
  },
  {
    id: '2',
    name: 'Luna',
    species: 'Cat',
    breed: 'Persian',
    image: null,
    status: 'found',
  },
  {
    id: '3',
    name: 'Buddy',
    species: 'Dog',
    breed: 'Golden Retriever',
    image: 'https://example.com/buddy.jpg',
    status: 'lost',
  },
];

const PetListScreen = () => {
  const handlePetPress = (pet: any) => {
    // TODO: Navigate to pet details screen or show modal
    console.log('Selected pet:', pet);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lost & Found Pets</Text>
      <FlatList
        data={dummyPets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PetListItem pet={item} onPress={handlePetPress} />
        )}
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default PetListScreen;