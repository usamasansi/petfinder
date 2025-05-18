import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function AdoptionProcedures() {
  const colorScheme = useColorScheme();
  const [expanded, setExpanded] = useState<number | null>(null);

  const steps = [
    {
      title: 'Step 1: Research and Prepare',
      description:
        'Learn about pet ownership responsibilities. Evaluate your lifestyle, budget, and living space to ensure you can provide a loving home for a pet.',
    },
    {
      title: 'Step 2: Visit Shelters or Rescues',
      description:
        'Visit local shelters or rescue organizations to meet pets. Spend time with potential companions to find one that matches your lifestyle.',
    },
    {
      title: 'Step 3: Complete an Application',
      description:
        'Submit an adoption application with details about yourself, your home, and references. This helps shelters ensure a good match.',
    },
    {
      title: 'Step 4: Home Visit and Interview',
      description:
        'Some shelters conduct a home visit or interview to verify that your living environment is safe and suitable for a pet.',
    },
    {
      title: 'Step 5: Meet Your Pet',
      description:
        'Arrange a meet-and-greet with the pet. Introduce them to family members or other pets to ensure compatibility.',
    },
    {
      title: 'Step 6: Finalize Adoption',
      description:
        'Sign the adoption contract, pay any fees, and bring your pet home. Prepare supplies like food, bedding, and toys in advance.',
    },
    {
      title: 'Step 7: Post-Adoption Care',
      description:
        'Schedule a vet visit, provide training, and allow your pet time to adjust. Follow up with the shelter for support if needed.',
    },
  ];

  const toggleCard = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      contentContainerStyle={styles.contentContainer}
    >
     

      <Text style={[styles.introText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
        Adopting a pet is a lifelong commitment. Follow these steps to find and welcome your new companion.
      </Text>

      {steps.map((step, index) => (
        <TouchableOpacity
          key={step.title}
          style={[
            styles.card,
            {
              backgroundColor: Colors[colorScheme ?? 'light'].card,
              shadowColor: Colors[colorScheme ?? 'light'].text,
            },
          ]}
          onPress={() => toggleCard(index)}
        >
          <View style={styles.cardHeader}>
            <Ionicons
              name="heart"
              size={24}
              color={Colors[colorScheme ?? 'light'].iconColors['heart']}
              style={styles.icon}
            />
            <Text style={[styles.cardTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              {step.title}
            </Text>
            <Ionicons
              name={expanded === index ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={Colors[colorScheme ?? 'light'].tabIconDefault}
              style={styles.chevron}
            />
          </View>
          {expanded === index && (
            <Text style={[styles.cardDescription, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              {step.description}
            </Text>
          )}
        </TouchableOpacity>
      ))}
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
  introText: {
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.7,
  },
  card: {
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  icon: {
    marginRight: 8,
  },
  chevron: {
    marginLeft: 8,
  },
});