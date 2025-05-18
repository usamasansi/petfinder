import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Pet {
  id: string;
  name: string;
  type: string;
  description: string;
  location: string;
  contact: string;
  photo?: string;
  additionalDetails?: string;
}

const mockPets: Pet[] = [
  {
    id: '1',
    name: 'Max',
    type: 'Dog',
    description: 'Friendly 2-year-old Labrador loves to play fetch and cuddle.',
    location: 'Lat: 29.8119, Lon: -95.3319',
    contact: 'adopter@example.com',
    photo: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    additionalDetails: 'Vaccinated, good with kids.',
  },
  {
    id: '2',
    name: 'Luna',
    type: 'Cat',
    description: 'Calm 3-year-old tabby enjoys sunny spots and gentle pets.',
    location: 'Lat: 40.7128, Lon: -74.0060',
    contact: 'catlover@example.com',
    photo: 'https://images.pexels.com/photos/32098248/pexels-photo-32098248/free-photo-of-close-up-portrait-of-a-domestic-cat-outdoors.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '3',
    name: 'Bella',
    type: 'Dog',
    description: 'Energetic 1-year-old Beagle, great for active families.',
    location: 'Lat: 32.7767, Lon: -96.7970',
    contact: 'dogfan@example.com',
    photo: 'https://images.pexels.com/photos/19562406/pexels-photo-19562406/free-photo-of-beagle-dog-standing-on-the-shore-of-the-lake-at-sunset.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    additionalDetails: 'Needs training, loves walks.',
  },
];

export default function AvailablePets() {
  const colorScheme = useColorScheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Dog' | 'Cat'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleButtonPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const filteredPets = mockPets.filter(
    (pet) =>
      (filter === 'All' || pet.type === filter) &&
      (pet.name.toLowerCase().includes(search.toLowerCase()) ||
        pet.type.toLowerCase().includes(search.toLowerCase())),
  );

  const handleContact = (pet: Pet) => {
    console.log('Contacting for:', pet.name, pet.contact);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Available Pets for Adoption
        </Text>

        <TextInput
          style={[
            styles.searchInput,
            {
              color: Colors[colorScheme ?? 'light'].text,
              backgroundColor: Colors[colorScheme ?? 'light'].card,
              borderColor: Colors[colorScheme ?? 'light'].tabIconDefault,
            },
          ]}
          placeholder="Search by name or type..."
          placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
          value={search}
          onChangeText={setSearch}
        />

        <TouchableOpacity
          style={[
            styles.filterHeader,
            { backgroundColor: Colors[colorScheme ?? 'light'].card },
          ]}
          onPress={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Text style={[styles.filterHeaderText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Filter by Type
          </Text>
          <Ionicons
            name={isFilterOpen ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={Colors[colorScheme ?? 'light'].tabIconDefault}
          />
        </TouchableOpacity>

        {isFilterOpen && (
          <View style={styles.filterOptions}>
            {['All', 'Dog', 'Cat'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      filter === type
                        ? Colors[colorScheme ?? 'light'].tint
                        : Colors[colorScheme ?? 'light'].card,
                  },
                ]}
                onPress={() => {
                  handleButtonPress();
                  setFilter(type as 'All' | 'Dog' | 'Cat');
                }}
              >
                <Animated.View style={[styles.buttonContent, { transform: [{ scale: scaleAnim }] }]}>
                  <Text
                    style={[
                      styles.filterButtonText,
                      {
                        color:
                          filter === type
                            ? '#fff'
                            : Colors[colorScheme ?? 'light'].text,
                      },
                    ]}
                  >
                    {type}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.petList}>
          {filteredPets.length === 0 ? (
            <Text style={[styles.noResults, { color: Colors[colorScheme ?? 'light'].text }]}>
              No pets found.
            </Text>
          ) : (
            filteredPets.map((pet) => (
              <View
                key={pet.id}
                style={[
                  styles.petCard,
                  { backgroundColor: Colors[colorScheme ?? 'light'].card },
                ]}
              >
                {pet.photo ? (
                  <Image source={{ uri: pet.photo }} style={styles.petImage} />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Ionicons
                      name="paw"
                      size={40}
                      color={Colors[colorScheme ?? 'light'].tabIconDefault}
                    />
                  </View>
                )}
                <Text style={[styles.petName, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {pet.name}
                </Text>
                <Text style={[styles.petType, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                  {pet.type}
                </Text>
                <Text
                  style={[styles.petDescription, { color: Colors[colorScheme ?? 'light'].text }]}
                  numberOfLines={2}
                >
                  {pet.description}
                </Text>
                <Text
                  style={[styles.petLocation, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}
                >
                  {pet.location}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.contactButton,
                    { backgroundColor: Colors[colorScheme ?? 'light'].iconColors['paw'] },
                  ]}
                  onPress={() => {
                    handleButtonPress();
                    handleContact(pet);
                  }}
                >
                  <Animated.View style={[styles.buttonContent, { transform: [{ scale: scaleAnim }] }]}>
                    <Ionicons name="paw" size={20} color="#fff" />
                    <Text style={styles.contactButtonText}>Contact</Text>
                  </Animated.View>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 60,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  filterHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  petList: {
    flexDirection: 'column',
    gap: 16,
  },
  petCard: {
    borderRadius: 8,
    padding: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  petImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  placeholderImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  petName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  petType: {
    fontSize: 16,
    marginBottom: 8,
  },
  petDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  petLocation: {
    fontSize: 14,
    marginBottom: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    lineHeight: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noResults: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});