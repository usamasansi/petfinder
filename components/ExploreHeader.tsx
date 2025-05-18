import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

interface ExploreHeaderProps {
  onCategoryChanged: (category: string) => void;
}

export const ExploreHeader: React.FC<ExploreHeaderProps> = ({ onCategoryChanged }) => {
  const colorScheme = useColorScheme();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Dog', 'Cat', 'Bird', 'Other'];

  const handleCategoryPress = (category: string) => {
    setActiveCategory(category);
    onCategoryChanged(category);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Ionicons name="paw" size={24} color={Colors[colorScheme ?? 'light'].tint} />
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            Pet Categories
          </Text>
        </View>
      </View>
      
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              activeCategory === category
                ? { backgroundColor: Colors[colorScheme ?? 'light'].tint }
                : { backgroundColor: '#FFFFFF' },
            ]}
            onPress={() => handleCategoryPress(category)}
          >
            <Text
              style={[
                styles.categoryText,
                {
                  color:
                    activeCategory === category
                      ? '#FFFFFF'
                      : '#007AFF',
                },
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,  // Adjust based on your app's status bar height
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
});