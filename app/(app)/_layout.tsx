import { Redirect, Stack } from 'expo-router';
import { Dimensions, View } from 'react-native';
import { useSession } from '../../contexts/userSignedInContext';
import { useEffect } from 'react';

export default function AppLayout() {
  const { session, isLoading } = useSession();

  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    console.log({ session })
  }, [session])

  if (isLoading) {
    return <View style={{ width, height, backgroundColor: '#D8D8D8' }} />;
  }

  if (!session) {
    return <Redirect href="/(auth)/signin" />;
  }

  return <Stack />;
}

