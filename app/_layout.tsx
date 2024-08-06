import { Slot, Stack } from 'expo-router';
import { SessionProvider } from '@/contexts/userSignedInContext';
import { SessionProvider as TokenSessionProvider } from '@/contexts/userTokenContext';
import { PaperProvider } from 'react-native-paper';
import { useFonts } from 'expo-font';
import { fonts } from '../constants/fonts';
import React from 'react';
import { Provider } from 'react-redux'
import { store } from '@/state/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { BottomSheetProvider } from '@/contexts/useBottomSheetContext';
import { SignupProvider } from '@/contexts/signupContext';
import { SnackbarProvider } from '@/contexts/snackbar.context';
import { Dimensions, View } from 'react-native';

export default function Root() {
  const { width, height } = Dimensions.get('window')

  const [fontsLoaded] = useFonts({
    [fonts.neurialGrotesk]: require('../assets/fonts/Fontspring-DEMO-neurialgrotesk-bold.otf'),
  });

  if (!fontsLoaded) {
    console.log({ fontsLoaded })
    // return null;
    // SplashScreen.preventAutoHideAsync()
    // return <View style={{ width, height, backgroundColor: '#D7D7D7' }} />;
  }

  SplashScreen.hideAsync();

  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <BottomSheetProvider>
          <PaperProvider>
            <SnackbarProvider>
              <SignupProvider>
                <TokenSessionProvider>
                  <SessionProvider>
                    <Slot />
                  </SessionProvider>
                </TokenSessionProvider>
              </SignupProvider>
            </SnackbarProvider>
          </PaperProvider>
        </BottomSheetProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
