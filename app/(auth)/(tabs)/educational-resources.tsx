import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/authStore';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import EducationalResources from '@/components/EducationalResources';

export default function EducationalResourcesScreen() {
  const colorScheme = useColorScheme();
  const { authenticated } = useAuthStore((state) => state.authState);

  if (!authenticated) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <Text style={[styles.text, { color: Colors[colorScheme ?? 'light'].text }]}>
          Please log in to access educational resources.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Tabs.Screen
        options={{
          title: 'Resources',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
          ),
        }}
      />
      <EducationalResources />
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