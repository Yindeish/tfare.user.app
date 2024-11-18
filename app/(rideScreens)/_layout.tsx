import { Redirect, Stack, Tabs } from 'expo-router';
import { Dimensions, View, Image } from 'react-native';
import { useSession } from '../../contexts/userSignedInContext';
import { useEffect } from 'react';
import { pages } from '@/constants/pages';
import { FontAwesome } from '@expo/vector-icons';
import { tabs } from '@/constants/tabs';
import Colors, { colors } from '@/constants/Colors';
import TabBartTitle from '@/components/tab/tabTitle';
import { images } from '@/constants/images';


export default function AppLayout() {
  const { userSession, isLoading } = useSession();

  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    console.log({ userSession })
  }, [userSession])

  if (isLoading) {
    return <View style={{ width, height, backgroundColor: '#D8D8D8' }} />;
  }

  if (!userSession) {
    return <Redirect href="/(auth)/signin" />;
  }

  else return <Stack
    screenOptions={{
      animation: 'slide_from_left',
      headerShown: false
    }}>
    <Stack.Screen name={pages.orderRide} />
    <Stack.Screen name={pages.availableRides} />
    <Stack.Screen name={`${pages.bookRide}/[rideId]`} />
    <Stack.Screen name={`${pages.rideBooked}/[rideId]`} />
    <Stack.Screen name={`${pages.buyTicket}/[rideId]`} />
    {/* <Stack.Screen name={`${pages.chat}/[rideId]`} /> */}
    {/* <Stack.Screen name={`(sharedScreens)/${pages.driverProfile}/[rideId]`} /> */}
    <Stack.Screen name={`${pages.paymentOptions}/[rideId]`} />
    <Stack.Screen name={`${pages.rideStarted}/[rideId]`} />
  </Stack>
}



