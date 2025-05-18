import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  image: string | null;
  status: 'lost' | 'found';
}

interface PetListItemProps {
  pet: Pet;
  onPress: (pet: Pet) => void;
}

const PetListItem: React.FC<PetListItemProps> = ({ pet, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(pet)}>
      {pet.image && <Image source={{ uri: pet.image }} style={styles.image} />}
      <View style={styles.info}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.details}>{pet.species} - {pet.breed}</Text>
        <Text style={[styles.status, pet.status === 'lost' ? styles.lost : styles.found]}>
          {pet.status.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  lost: {
    color: '#FF3B30',
  },
  found: {
    color: '#34C759',
  },
});

export default PetListItem;