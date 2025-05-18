import React from 'react';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
};

export function TabBarIcon({ name, color }: Props) {
  return <Ionicons name={name} size={24} color={color} />;
}
