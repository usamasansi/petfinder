import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { User } from '@/constants/Dummydata';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Props {
  user: User;
}

export default function UserProfileCard({ user }: Props) {
  const colorScheme = useColorScheme();
  const editButtonScale = useRef(new Animated.Value(1)).current;
  const badgeScales = user.pets.map(() => useRef(new Animated.Value(1)).current);
  const fieldScales = [
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
  ];

  const handlePressIn = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const profileFields = [
    { label: 'First Name', value: user.firstName, icon: 'person', scale: fieldScales[0] },
    { label: 'Last Name', value: user.lastName, icon: 'person', scale: fieldScales[1] },
    { label: 'Phone', value: user.phoneNumber, icon: 'call', scale: fieldScales[2] },
    { label: 'Email', value: user.email, icon: 'mail', scale: fieldScales[3] },
    { label: 'Address', value: user.address, icon: 'location', scale: fieldScales[4] },
  ];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: Colors[colorScheme ?? 'light'].card,
            borderColor: Colors[colorScheme ?? 'light'].tint,
          },
        ]}
      >
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View
              style={[
                styles.avatarContainer,
                { backgroundColor: Colors[colorScheme ?? 'light'].tint },
              ]}
            >
              <Ionicons
                name="person-circle"
                size={60}
                color={Colors[colorScheme ?? 'light'].text}
              />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.name}>
                {user.firstName} {user.lastName}
              </Text>
              <Text
                style={[styles.email, { color: Colors[colorScheme ?? 'light'].text }]}
              >
                {user.email}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.editButton,
              {
                backgroundColor: Colors[colorScheme ?? 'light'].tint,
              },
            ]}
            onPressIn={() => handlePressIn(editButtonScale)}
            onPressOut={() => handlePressOut(editButtonScale)}
            activeOpacity={0.8}
            onPress={() => {
              console.log('Navigating to edit-profile with user:', user);
              router.push({
                pathname: '/(auth)/(tabs)/edit-profile',
                params: { user: JSON.stringify(user) },
              });
            }}
          >
            <Animated.View style={{ transform: [{ scale: editButtonScale }] }}>
              <Text style={styles.editButtonText}>
                Edit Profile
              </Text>
            </Animated.View>
          </TouchableOpacity>
          <View style={styles.separator} />
          <Text
            style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}
          >
            Contact Information
          </Text>
          {profileFields.map((field, index) => (
            <TouchableOpacity
              key={field.label}
              style={styles.fieldContainer}
              onPressIn={() => handlePressIn(field.scale)}
              onPressOut={() => handlePressOut(field.scale)}
              activeOpacity={0.8}
            >
              <Animated.View style={{ transform: [{ scale: field.scale }] }}>
                <View style={styles.fieldRow}>
                  <Ionicons
                    name={field.icon as any}
                    size={20}
                    color={Colors[colorScheme ?? 'light'].tint}
                    style={styles.fieldIcon}
                  />
                  <View>
                    <Text
                      style={[
                        styles.fieldLabel,
                        { color: Colors[colorScheme ?? 'light'].text },
                      ]}
                    >
                      {field.label}
                    </Text>
                    <Text
                      style={[
                        styles.fieldValue,
                        { color: Colors[colorScheme ?? 'light'].text },
                      ]}
                    >
                      {field.value}
                    </Text>
                  </View>
                </View>
              </Animated.View>
              {index < profileFields.length - 1 && (
                <View style={styles.fieldSeparator} />
              )}
            </TouchableOpacity>
          ))}
          <View style={styles.separator} />
          <Text
            style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}
          >
            My Pets
          </Text>
          <View style={styles.petContainer}>
            {user.pets.length > 0 ? (
              user.pets.map((pet, index) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[
                    styles.petBadge,
                    {
                      backgroundColor: Colors[colorScheme ?? 'light'].tint,
                      borderColor: Colors[colorScheme ?? 'light'].tint,
                    },
                  ]}
                  onPressIn={() => handlePressIn(badgeScales[index])}
                  onPressOut={() => handlePressOut(badgeScales[index])}
                  activeOpacity={0.8}
                  onPress={() => {} /* Add navigation to pet-details later */}
                >
                  <Animated.View
                    style={{ transform: [{ scale: badgeScales[index] }] }}
                  >
                    <Text style={styles.petBadgeText}>
                      {pet.name} ({pet.type}, {pet.breed})
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
              ))
            ) : (
              <Text
                style={[styles.noPetsText, { color: Colors[colorScheme ?? 'light'].text }]}
              >
                No pets listed yet.
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Ensure black background outside the card
  },
  card: {
    width: '100%',
    maxHeight: 700,
    margin: 12,
    borderRadius: 16,
    borderWidth: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    alignSelf: 'center',
  },
  scrollContainer: {
    backgroundColor: '#121212', // Ensure black background
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    color: 'white',
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
    color: '#FFFFFF',
  },
  editButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.light.tint,
    opacity: 0.3,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#FFFFFF',
  },
  fieldContainer: {
    marginVertical: 4,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#1A1A1A',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  fieldIcon: {
    marginRight: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
    color: '#000000',
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
    color: '#000000',
  },
  fieldSeparator: {
    height: 1,
    backgroundColor: Colors.light.tint,
    opacity: 0.2,
    marginVertical: 8,
  },
  petContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  petBadge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  petBadgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  noPetsText: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 8,
    color: '#FFFFFF',
  },
});