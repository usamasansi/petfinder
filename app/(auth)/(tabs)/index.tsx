import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/authStore';
import { ExploreHeader } from '@/components/ExploreHeader';
import Listings from '@/components/Listing';
import { adoptablePets } from '@/constants/Dummydata';

const dummyReports = [
  {
    id: '1',
    name: 'Milo',
    breed: 'Golden Retriever',
    location: 'Downtown LA',
    date: '2025-05-10',
    image: 'https://placedog.net/400/300?id=1',
  },
  {
    id: '2',
    name: 'Whiskers',
    breed: 'Siamese Cat',
    location: 'Pasadena',
    date: '2025-05-12',
    image: 'https://cdn2.thecatapi.com/images/3nm.jpg'
  },
  {
    id: '3',
    name: 'Buddy',
    breed: 'Beagle',
    location: 'Santa Monica',
    date: '2025-05-13',
    image: 'https://placedog.net/400/300?id=2',
  },
];

function LostReportsFeed() {
  return (
    <View style={styles.feedContainer}>
      {dummyReports.map((report) => (
        <View key={report.id} style={styles.reportCard}>
          <Image source={{ uri: report.image }} style={styles.reportImage} />
          <View style={styles.reportContent}>
            <Text style={styles.reportName}>{report.name} ({report.breed})</Text>
            <Text style={styles.reportDetails}>Location: {report.location}</Text>
            <Text style={styles.reportDetails}>Reported: {report.date}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { authenticated } = useAuthStore((state) => state.authState);
  const [category, setCategory] = useState<string>('Cat');

  const items = useMemo(() => adoptablePets, []);

  const onDataChanged = (newCategory: string) => {
    setCategory(newCategory);
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
        }}
      />
      <ScrollView
        style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
        contentContainerStyle={styles.contentContainer}
      >
        {authenticated ? (
          <>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Featured Pets</Text>
            <Listings listings={items} category={category} />

            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Recent Lost Pet Reports</Text>
            <LostReportsFeed />
          </>
        ) : (
          <Text style={[styles.text, { color: Colors[colorScheme ?? 'light'].text }]}>Please log in to access Petfinder features.</Text>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 48,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginVertical: 16,
    marginLeft: 8,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.7,
  },
  feedContainer: {
    paddingHorizontal: 8,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  reportContent: {
    flex: 1,
  },
  reportName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  reportDetails: {
    fontSize: 14,
    color: '#555',
  },
});
