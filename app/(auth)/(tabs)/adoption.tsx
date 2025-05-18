import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/authStore';
import AdoptionProcedures from '@/components/AdoptionProcedures';

export default function AdoptionScreen() {
  const colorScheme = useColorScheme();
  const { authenticated } = useAuthStore((state) => state.authState);

  if (!authenticated) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <Text style={[styles.text, { color: Colors[colorScheme ?? 'light'].text }]}>
          Please log in to view adoption procedures.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Tabs.Screen
        options={{
          title: 'Adoption',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="heart"
              size={24}
              color={
                focused
                  ? Colors[colorScheme ?? 'light'].tabIconSelected
                  : Colors[colorScheme ?? 'light'].tabIconDefault
              }
            />
          ),
        }}
      />
      <AdoptionProcedures />
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