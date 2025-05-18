import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Resource {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
}

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'How to Train Your Puppy',
    category: 'Training',
    description: 'Learn basic commands and house training tips for your new puppy.',
    url: 'https://www.aspca.org/pet-care/dog-care/dog-training',
  },
  {
    id: '2',
    title: 'Cat Nutrition Guide',
    category: 'Care',
    description: 'Understand the dietary needs of your cat for a healthy life.',
    url: 'https://www.petfinder.com/cats/cat-nutrition/',
  },
  {
    id: '3',
    title: 'Adopting a Shelter Pet',
    category: 'Adoption',
    description: 'Steps to prepare for adopting a pet from a shelter.',
    url: 'https://www.humanesociety.org/resources/how-adopt-pet',
  },
  {
    id: '4',
    title: 'Grooming Your Dog',
    category: 'Care',
    description: 'Tips for keeping your dog’s coat clean and healthy.',
    url: 'https://www.akc.org/expert-advice/health/how-to-groom-a-dog/',
  },
];

export default function EducationalResources() {
  const colorScheme = useColorScheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Care' | 'Training' | 'Adoption'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(1))[0];

  const buttonColor = colorScheme === 'dark' ? '#0A84FF' : '#007AFF';

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

  const filteredResources = mockResources.filter(
    (resource) =>
      (filter === 'All' || resource.category === filter) &&
      (resource.title.toLowerCase().includes(search.toLowerCase()) ||
        resource.category.toLowerCase().includes(search.toLowerCase())),
  );

  const handleViewResource = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Cannot open URL: ${url}`);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Educational Resources
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
          placeholder="Search by title or category..."
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
            Filter by Category
          </Text>
          <Ionicons
            name={isFilterOpen ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={Colors[colorScheme ?? 'light'].tabIconDefault}
          />
        </TouchableOpacity>

        {isFilterOpen && (
          <View style={styles.filterOptions}>
            {['All', 'Care', 'Training', 'Adoption'].map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      filter === category
                        ? buttonColor
                        : Colors[colorScheme ?? 'light'].card,
                  },
                ]}
                onPress={() => {
                  handleButtonPress();
                  setFilter(category as 'All' | 'Care' | 'Training' | 'Adoption');
                }}
              >
                <Animated.View style={[styles.buttonContent, { transform: [{ scale: scaleAnim }] }]}>
                  <Text
                    style={[
                      styles.filterButtonText,
                      {
                        color:
                          filter === category
                            ? '#fff'
                            : Colors[colorScheme ?? 'light'].text,
                      },
                    ]}
                  >
                    {category}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.resourceList}>
          {filteredResources.length === 0 ? (
            <Text style={[styles.noResults, { color: Colors[colorScheme ?? 'light'].text }]}>
              No resources found.
            </Text>
          ) : (
            filteredResources.map((resource) => (
              <View
                key={resource.id}
                style={[
                  styles.resourceCard,
                  { backgroundColor: Colors[colorScheme ?? 'light'].card },
                ]}
              >
                <Text style={[styles.resourceTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {resource.title}
                </Text>
                <Text style={[styles.resourceCategory, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                  {resource.category}
                </Text>
                <Text
                  style={[styles.resourceDescription, { color: Colors[colorScheme ?? 'light'].text }]}
                  numberOfLines={2}
                >
                  {resource.description}
                </Text>
                <TouchableOpacity
                  style={[styles.viewButton, { backgroundColor: buttonColor }]}
                  onPress={() => {
                    handleButtonPress();
                    handleViewResource(resource.url);
                  }}
                >
                  <Animated.View style={[styles.buttonContent, { transform: [{ scale: scaleAnim }] }]}>
                    <Ionicons name="book" size={20} color="#fff" />
                    <Text style={styles.viewButtonText}>View Resource</Text>
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
  resourceList: {
    flexDirection: 'column',
    gap: 16,
  },
  resourceCard: {
    borderRadius: 8,
    padding: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  resourceTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  resourceCategory: {
    fontSize: 16,
    marginBottom: 8,
  },
  resourceDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  viewButton: {
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
  viewButtonText: {
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