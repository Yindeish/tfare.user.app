import { Redirect, Stack, Tabs } from 'expo-router';
import { Dimensions, View, Image } from 'react-native';
import { useEffect } from 'react';
import { pages } from '@/constants/pages';
import { FontAwesome } from '@expo/vector-icons';
import { tabs } from '@/constants/tabs';
import Colors, { colors } from '@/constants/Colors';
import TabBartTitle from '@/components/tab/tabTitle';
import { images } from '@/constants/images';


export default function AppLayout() {

  const { width, height } = Dimensions.get('window');

  return <Stack
    screenOptions={{
      animation: 'slide_from_left',
      headerShown: false
    }}>
    <Stack.Screen name={'[rideId]'} />
  </Stack>
}



