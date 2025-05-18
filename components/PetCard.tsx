import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Pet, StoreItem } from '../constants/Dummydata';

interface Props {
  pet: Pet | StoreItem;
}

export default function PetCard({ pet }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{pet.name}</Text>
      <Text style={styles.details}>
        {'type' in pet ? `${pet.type} - ${pet.breed}` : `Price: $${pet.price}`}
      </Text>
      {'lastSeen' in pet && pet.lastSeen && (
        <Text style={styles.details}>Last Seen: {pet.lastSeen}</Text>
      )}
      {'foundAt' in pet && pet.foundAt && (
        <Text style={styles.details}>Found At: {pet.foundAt}</Text>
      )}
      {'age' in pet && pet.age && <Text style={styles.details}>Age: {pet.age}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 10, backgroundColor: '#fff', borderRadius: 10, margin: 10, elevation: 2 },
  image: { width: '100%', height: 150, borderRadius: 10 },
  name: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  details: { fontSize: 14, color: '#666', marginTop: 5 },
});