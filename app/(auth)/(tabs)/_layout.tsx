import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/authStore';
import { useCheckAuthentication } from '@/hooks/useCheckAuthentication';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { authenticated, userId } = useAuthStore((state) => state.authState);
  console.log('🚀 ~ TabLayout ~ userId:', userId);
  console.log('🚀 ~ TabLayout ~ authenticated:', authenticated);
  console.log('🚀 ~ TabLayout ~ Rendering tabs with icons');

  useCheckAuthentication(authenticated);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          height: 60,
          paddingBottom: 5,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        headerTitleStyle: {
          color: Colors[colorScheme ?? 'light'].text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="QuickActions"
        options={{
          title: 'Actions',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'rocket' : 'rocket-outline'}
              color={color}
            />
          ),
        }}
      />
    <Tabs.Screen
        name="AI Recognition"
        options={{
          title: "AI",
          tabBarIcon: ({ color }) => <TabBarIcon name="sparkles" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'person' : 'person-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="lost-and-found"
        options={{
          title: 'Lost & Found',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'search' : 'search-outline'}
              color={color}
            />
          ),
        }}
      />
    
      <Tabs.Screen
        name="edit-profile"
        options={{
          title: 'Edit Profile',
          href: null, // Hide from tab bar
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="pet-list"
        options={{
          title: 'Lost & Found Pets',
          href: null, // Hide from tab bar
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="report-lost-pet"
        options={{
          title: 'Report Lost Pet',
          href: null, // Hide from tab bar
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="adoption"
        options={{
          title: 'Report Lost Pet',
          href: null, // Hide from tab bar
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="list-pet"
        options={{
          title: 'Report Lost Pet',
          href: null, // Hide from tab bar
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="available-pets"
        options={{
          title: 'Report Lost Pet',
          href: null, // Hide from tab bar
          headerShown: true,
        }}
      />
        <Tabs.Screen
        name="pet-store"
        options={{
          title: 'Pet Store',
          href: null, // Hide from tab bar
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="educational-resources"
        options={{
          title: 'Educational Resources',
          href: null, // Hide from tab bar
          headerShown: true,
        }}
      />
       <Tabs.Screen
        name="signin"
        options={{
          title: '',
          href: null, // Hide from tab bar
          headerShown: false,
        }}
      />
       <Tabs.Screen
        name="social-media"
        options={{
          title: 'Social Media',
          href: null, // Hide from tab bar
          headerShown: true,
        }}
      />
    </Tabs>
    
  );
}