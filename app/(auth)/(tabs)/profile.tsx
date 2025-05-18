import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UserProfileCard from '@/components/UserProfileCard';
import { users } from '@/constants/Dummydata';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const { authenticated } = useAuthStore((state) => state.authState);

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {/* <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>User Profile</Text> */}
      {authenticated ? (
        <UserProfileCard user={users[0]} />
      ) : (
        <Text style={[styles.text, { color: Colors[colorScheme ?? 'light'].text }]}>
          Please log in to view your profile.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  text: { fontSize: 16, textAlign: 'center' },
});