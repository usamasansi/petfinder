import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { useFormik } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { listPetSchema } from '../validation/listPetSchema';

export default function ListPet() {
  const colorScheme = useColorScheme();
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [isAdditionalOpen, setIsAdditionalOpen] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleButtonPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

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
      additionalDetails: '',
    },
    validationSchema: listPetSchema,
    onSubmit: (values) => {
      console.log('Pet Listed:', { ...values, photo });
      formik.resetForm();
      setPhoto(undefined);
      setIsAdditionalOpen(false);
    },
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          List a Pet for Finding
        </Text>

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
            <Text style={[styles.error, { color: Colors[colorScheme ?? 'light'].iconColors['paw'] }]}>
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
            <Text style={[styles.error, { color: Colors[colorScheme ?? 'light'].iconColors['paw'] }]}>
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
            <Text style={[styles.error, { color: Colors[colorScheme ?? 'light'].iconColors['paw'] }]}>
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
            placeholder="Location"
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            value={formik.values.location}
            onChangeText={formik.handleChange('location')}
          />
          {formik.errors.location && (
            <Text style={[styles.error, { color: Colors[colorScheme ?? 'light'].iconColors['paw'] }]}>
              {formik.errors.location}
            </Text>
          )}

          <TouchableOpacity
            style={[styles.locateButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={() => {
              handleButtonPress();
              locateMe();
            }}
          >
            <Animated.View style={[styles.buttonContent, { transform: [{ scale: scaleAnim }] }]}>
              <Ionicons name="location-sharp" size={20} color="#fff" />
              <Text style={styles.locateButtonText}>Locate Me</Text>
            </Animated.View>
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
            <Text style={[styles.error, { color: Colors[colorScheme ?? 'light'].iconColors['paw'] }]}>
              {formik.errors.contact}
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.sectionHeader,
              { backgroundColor: Colors[colorScheme ?? 'light'].card },
            ]}
            onPress={() => setIsAdditionalOpen(!isAdditionalOpen)}
          >
            <Text style={[styles.sectionHeaderText, { color: Colors[colorScheme ?? 'light'].text }]}>
              Additional Details (Optional)
            </Text>
            <Ionicons
              name={isAdditionalOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={Colors[colorScheme ?? 'light'].tabIconDefault}
            />
          </TouchableOpacity>
          {isAdditionalOpen && (
            <TextInput
              style={[
                styles.input,
                {
                  color: Colors[colorScheme ?? 'light'].text,
                  backgroundColor: Colors[colorScheme ?? 'light'].card,
                  height: 100,
                },
              ]}
              placeholder="Additional Details (e.g., age, breed, health)"
              placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
              value={formik.values.additionalDetails}
              onChangeText={formik.handleChange('additionalDetails')}
              multiline
            />
          )}

          <View style={styles.imageButtonsContainer}>
            <TouchableOpacity
              style={[styles.imageButton, { backgroundColor: Colors[colorScheme ?? 'light'].iconColors['paw'] }]}
              onPress={() => {
                handleButtonPress();
                pickImage();
              }}
            >
              <Animated.View style={[styles.buttonContent, { transform: [{ scale: scaleAnim }] }]}>
                <Ionicons name="image" size={20} color="#fff" />
                <Text style={styles.imageButtonText}>Pick from Gallery</Text>
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cameraButton, { backgroundColor: Colors[colorScheme ?? 'light'].iconColors['camera'] }]}
              onPress={() => {
                handleButtonPress();
                takePhoto();
              }}
            >
              <Animated.View style={[styles.buttonContent, { transform: [{ scale: scaleAnim }] }]}>
                <Ionicons name="camera" size={20} color="#fff" />
                <Text style={styles.cameraButtonText}>Take Photo</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>

          {photo && <Image source={{ uri: photo }} style={styles.image} />}

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={() => {
              handleButtonPress();
              formik.handleSubmit();
            }}
          >
            <Animated.View style={[styles.buttonContent, { transform: [{ scale: scaleAnim }] }]}>
              <Ionicons name="paw" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>List Pet</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </Animated.View>
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
  form: {
    flexDirection: 'column',
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginVertical: 4,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  error: {
    fontSize: 12,
    marginBottom: 8,
  },
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
  },
  locateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    lineHeight: 20, // Match icon size for alignment
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
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
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    lineHeight: 20,
  },
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
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    lineHeight: 20,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginVertical: 8,
  },
  submitButton: {
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
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    lineHeight: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});