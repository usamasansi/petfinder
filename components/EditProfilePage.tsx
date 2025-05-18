import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, TextInput } from 'react-native';
import { User } from '@/constants/Dummydata';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';

export default function EditProfilePage() {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const styles = createStyles(colorScheme);
  const { user: userParam } = useLocalSearchParams();
  console.log('EditProfilePage received userParam:', userParam);
  let user: User | null = null;
  try {
    user = userParam ? JSON.parse(userParam as string) : null;
  } catch (error) {
    console.error('Failed to parse userParam:', error);
  }

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    email: user?.email || '',
    address: user?.address || '',
  });

  const saveButtonScale = useRef(new Animated.Value(1)).current;
  const cancelButtonScale = useRef(new Animated.Value(1)).current;
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

  const handleSave = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const profileFields = [
    {
      label: 'First Name',
      value: formData.firstName,
      onChange: (text: string) => setFormData({ ...formData, firstName: text }),
      icon: 'person',
      scale: fieldScales[0],
    },
    {
      label: 'Last Name',
      value: formData.lastName,
      onChange: (text: string) => setFormData({ ...formData, lastName: text }),
      icon: 'person',
      scale: fieldScales[1],
    },
    {
      label: 'Phone',
      value: formData.phoneNumber,
      onChange: (text: string) => setFormData({ ...formData, phoneNumber: text }),
      icon: 'call',
      scale: fieldScales[2],
    },
    {
      label: 'Email',
      value: formData.email,
      onChange: (text: string) => setFormData({ ...formData, email: text }),
      icon: 'mail',
      scale: fieldScales[3],
    },
    {
      label: 'Address',
      value: formData.address,
      onChange: (text: string) => setFormData({ ...formData, address: text }),
      icon: 'location',
      scale: fieldScales[4],
    },
  ];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: '#121212',
            borderColor: Colors[colorScheme].tint,
          },
        ]}
      >
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>
               Contact Information
            </Text>
          </View>
          <View style={styles.separator} />
          <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>
           
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
                    color={Colors[colorScheme].tint}
                    style={styles.fieldIcon}
                  />
                  <View style={styles.inputContainer}>
                    <Text style={[styles.fieldLabel, { color: '#FFFFFF' }]}>
                      {field.label}
                    </Text>
                    <TextInput
                      style={[styles.input, { color: '#FFFFFF', backgroundColor: '#1A1A1A' }]}
                      value={field.value}
                      onChangeText={field.onChange}
                      placeholder={`Enter ${field.label}`}
                      placeholderTextColor={'#FFFFFF80'}
                    />
                  </View>
                </View>
              </Animated.View>
              {index < profileFields.length - 1 && (
                <View style={styles.fieldSeparator} />
              )}
            </TouchableOpacity>
          ))}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                {
                  backgroundColor: '#121212',
                  borderColor: Colors[colorScheme].tint,
                },
              ]}
              onPressIn={() => handlePressIn(saveButtonScale)}
              onPressOut={() => handlePressOut(saveButtonScale)}
              activeOpacity={0.8}
              onPress={handleSave}
            >
              <Animated.View style={{ transform: [{ scale: saveButtonScale }] }}>
                <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Save</Text>
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                {
                  backgroundColor: '#121212',
                  borderColor: Colors[colorScheme].tint,
                },
              ]}
              onPressIn={() => handlePressIn(cancelButtonScale)}
              onPressOut={() => handlePressOut(cancelButtonScale)}
              activeOpacity={0.8}
              onPress={handleCancel}
            >
              <Animated.View style={{ transform: [{ scale: cancelButtonScale }] }}>
                <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Cancel</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const createStyles = (colorScheme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
    },
    card: {
      width: '90%',
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
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 12,
    },
    separator: {
      height: 1,
      backgroundColor: Colors[colorScheme].tint,
      opacity: 0.4,
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
    inputContainer: {
      flex: 1,
      backgroundColor: '#1A1A1A',
    },
    fieldLabel: {
      fontSize: 14,
      fontWeight: '500',
      opacity: 0.7,
    },
    input: {
      fontSize: 16,
      fontWeight: '500',
      marginTop: 2,
      paddingVertical: 4,
    },
    fieldSeparator: {
      height: 1,
      backgroundColor: Colors[colorScheme].tint,
      opacity: 0.3,
      marginVertical: 8,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    saveButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: 'center',
      marginRight: 8,
      borderWidth: 1,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: 'center',
      marginLeft: 8,
      borderWidth: 1,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });