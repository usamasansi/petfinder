import React from 'react';
import { View, StyleSheet } from 'react-native';
import ReportForm from '../../../components/ReportForm';
import { useAuthStore } from '@/store/authStore';
import { Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ReportLostPetScreen() {
  const { authenticated } = useAuthStore((state) => state.authState);
  const colorScheme = useColorScheme();

  if (!authenticated) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { color: Colors[colorScheme ?? 'light'].text }]}>
          Please log in to report a lost pet.
        </Text>
      </View>
    );
  }

  return <ReportForm />;
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