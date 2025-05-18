import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';

export default function QuickActionsScreen() {
  const colorScheme = useColorScheme();
  const { authenticated } = useAuthStore((state) => state.authState);
  const router = useRouter();

  type IconName = 'paw' | 'alert-circle' | 'search' | 'heart' | 'cart' | 'share-social' | 'camera'| 'book';

  const actions: { title: string; route: string; icon: IconName }[] = [
    { title: 'List a Pet', route: '/(auth)/(tabs)/pet-list', icon: 'paw' },
    { title: 'Report Lost Pet', route: '/(auth)/(tabs)/report-lost-pet', icon: 'alert-circle' },
    { title: 'Found a Pet', route: '/(auth)/(tabs)/list-pet', icon: 'search' },
    { title: 'Adoption Process', route: '/(auth)/(tabs)/adoption', icon: 'heart' },
     { title: 'Available Pets for Adoption', route: '/(auth)/(tabs)/available-pets', icon: 'heart' },
    { title: 'Pet Store', route: '/(auth)/(tabs)/pet-store', icon: 'cart' },
    { title: 'Social Media', route: '/(auth)/(tabs)/social-media', icon: 'share-social' },
    { title: 'AI Recognition', route: '/(auth)/(tabs)/AI Recognition', icon: 'camera' },
    { title: 'Educational Resources', route: '/(auth)/(tabs)/educational-resources', icon: 'book' },

  ];

  const buttonAnimations = actions.map(() => new Animated.Value(1));

  const animateIn = (index: number) => {
    Animated.spring(buttonAnimations[index], {
      toValue: 0.96,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const animateOut = (index: number) => {
    Animated.spring(buttonAnimations[index], {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = (route: string) => {
    router.push({ pathname: route });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {authenticated ? (
        <>
          <View style={styles.grid}>
            {actions.map((action, index) => (
              <TouchableWithoutFeedback
                key={action.title}
                onPressIn={() => animateIn(index)}
                onPressOut={() => animateOut(index)}
                onPress={() => handlePress(action.route)}
              >
                <Animated.View
                  style={[
                    styles.card,
                    {
                      backgroundColor: Colors[colorScheme ?? 'light'].iconColors[action.icon],
                      transform: [{ scale: buttonAnimations[index] }],
                      shadowColor: Colors[colorScheme ?? 'light'].text,
                    },
                  ]}
                >
                  <Ionicons
                    name={action.icon as any}
                    size={30}
                    color="#fff"
                    style={styles.icon}
                  />
                  <Text style={styles.cardText}>{action.title}</Text>
                </Animated.View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </>
      ) : (
        <Text style={[styles.text, { color: Colors[colorScheme ?? 'light'].text }]}>
          Please log in to access Quick Actions.
        </Text>
      )}
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
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.7,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 20,
  },
  card: {
    width: '47%',
    paddingVertical: 24,
    paddingHorizontal: 10,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  icon: {
    marginBottom: 10,
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});