import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/authStore';
// Update the import path below if TabBarIcon is not in the specified location
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import ListPet from '@/components/ListPet';

export default function ListPetScreen() {
  const colorScheme = useColorScheme();
  const { authenticated } = useAuthStore((state) => state.authState);

  if (!authenticated) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <Text style={[styles.text, { color: Colors[colorScheme ?? 'light'].text }]}>
          Please log in to list a pet.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Tabs.Screen
        options={{
          title: 'List Pet',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'paw' : 'paw-outline'} color={color} />
          ),
        }}
      />
      <ListPet />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});