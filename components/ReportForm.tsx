import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useFormik } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { reportSchema } from '../validation/reportSchema';

export default function ReportForm() {
  const colorScheme = useColorScheme();
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const locateMe = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need location permissions to find your location.');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    const locationString = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
    formik.setFieldValue('location', locationString);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      type: '',
      description: '',
      location: '',
      contact: '',
    },
    validationSchema: reportSchema,
    onSubmit: (values) => {
      console.log('Form Submitted:', { ...values, photo });
      formik.resetForm();
      setPhoto(undefined);
    },
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      contentContainerStyle={styles.contentContainer as any}
    >
   \

      <View style={styles.form}>
        <TextInput
          style={[
            styles.input,
            {
              color: Colors[colorScheme ?? 'light'].text,
              backgroundColor: Colors[colorScheme ?? 'light'].card,
            },
          ]}
          placeholder="Pet Name"
          placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
          value={formik.values.name}
          onChangeText={formik.handleChange('name')}
        />
        {formik.errors.name && (
          <Text style={[styles.error, { color: Colors[colorScheme ?? 'light'].iconColors['alert-circle'] }]}>
            {formik.errors.name}
          </Text>
        )}

        <TextInput
          style={[
            styles.input,
            {
              color: Colors[colorScheme ?? 'light'].text,
              backgroundColor: Colors[colorScheme ?? 'light'].card,
            },
          ]}
          placeholder="Pet Type (e.g., Dog, Cat)"
          placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
          value={formik.values.type}
          onChangeText={formik.handleChange('type')}
        />
        {formik.errors.type && (
          <Text style={[styles.error, { color: Colors[colorScheme ?? 'light'].iconColors['alert-circle'] }]}>
            {formik.errors.type}
          </Text>
        )}

        <TextInput
          style={[
            styles.input,
            {
              color: Colors[colorScheme ?? 'light'].text,
              backgroundColor: Colors[colorScheme ?? 'light'].card,
              height: 100,
            },
          ]}
          placeholder="Description"
          placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
          value={formik.values.description}
          onChangeText={formik.handleChange('description')}
          multiline
        />
        {formik.errors.description && (
          <Text style={[styles.error, { color: Colors[colorScheme ?? 'light'].iconColors['alert-circle'] }]}>
            {formik.errors.description}
          </Text>
        )}

        <TextInput
          style={[
            styles.input,
            {
              color: Colors[colorScheme ?? 'light'].text,
              backgroundColor: Colors[colorScheme ?? 'light'].card,
            },
          ]}
          placeholder="Last Seen Location"
          placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
          value={formik.values.location}
          onChangeText={formik.handleChange('location')}
        />
        {formik.errors.location && (
          <Text style={[styles.error, { color: Colors[colorScheme ?? 'light'].iconColors['alert-circle'] }]}>
            {formik.errors.location}
          </Text>
        )}

        <TouchableOpacity
          style={[
            styles.locateButton,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint },
          ]}
          onPress={locateMe}
        >
          <Ionicons name="location-sharp" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.locateButtonText}>Locate Me</Text>
        </TouchableOpacity>

        <TextInput
          style={[
            styles.input,
            {
              color: Colors[colorScheme ?? 'light'].text,
              backgroundColor: Colors[colorScheme ?? 'light'].card,
            },
          ]}
          placeholder="Contact Email"
          placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
          value={formik.values.contact}
          onChangeText={formik.handleChange('contact')}
          keyboardType="email-address"
        />
        {formik.errors.contact && (
          <Text style={[styles.error, { color: Colors[colorScheme ?? 'light'].iconColors['alert-circle'] }]}>
            {formik.errors.contact}
          </Text>
        )}

        <View style={styles.imageButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.imageButton,
              { backgroundColor: Colors[colorScheme ?? 'light'].iconColors['alert-circle'] },
            ]}
            onPress={pickImage}
          >
            <Ionicons name="image" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.imageButtonText}>Pick from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.cameraButton,
              { backgroundColor: Colors[colorScheme ?? 'light'].iconColors['camera'] },
            ]}
            onPress={takePhoto}
          >
            <Ionicons name="camera" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.cameraButtonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>

        {photo && <Image source={{ uri: photo }} style={styles.image} />}

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint },
          ]}
          onPress={() => formik.handleSubmit()}
        >
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Only ViewStyle properties for container and contentContainer
  container: {
    flex: 1,
  } as const,
  contentContainer: {
    padding: 20,
    paddingBottom: 60,
  } as const,
  // Only TextStyle properties for sectionTitle, error, locateButtonText, imageButtonText, cameraButtonText, submitButtonText
  sectionTitle: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
  } as const,
  form: {
    flexDirection: 'column',
    gap: 10,
  } as const,
  // Only ViewStyle properties for input, but TextInput accepts both ViewStyle and TextStyle
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginVertical: 4,
  } as const,
  error: {
    fontSize: 12,
    marginBottom: 8,
  } as const,
  locateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  } as const,
  locateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  } as const,
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  } as const,
  imageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  } as const,
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  } as const,
  cameraButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  } as const,
  cameraButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  } as const,
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginVertical: 8,
  } as const,
  submitButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  } as const,
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  } as const,
  icon: {
    marginRight: 4,
  } as const,
});