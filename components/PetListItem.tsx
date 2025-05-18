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
  theme?: 'light' | 'dark';
}

const PetListItem: React.FC<PetListItemProps> = ({ pet, onPress, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  return (
    <TouchableOpacity style={[styles.container, isDark && styles.containerDark]} onPress={() => onPress(pet)}>
      {pet.image && <Image source={{ uri: pet.image }} style={styles.image} />}
      <View style={styles.info}>
        <Text style={[styles.name, isDark && styles.textDark]}>{pet.name}</Text>
        <Text style={[styles.details, isDark && styles.textDark]}> {pet.species} - {pet.breed}</Text>
        <Text style={[styles.status, pet.status === 'lost' ? styles.lost : styles.found, isDark && styles.statusDark]}>          
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
  containerDark: {
    backgroundColor: 'dark-gray',
    borderBottomColor: '#333',
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
    color: '#111',
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
  textDark: {
    color: '#fff',
  },
  statusDark: {
    opacity: 0.8,
  },
});

export default PetListItem;