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
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as SplashScreen from 'expo-splash-screen';

export default function Root() {

  const [fontsLoaded] = useFonts({
    [fonts.neurialGrotesk]: require('../assets/fonts/Fontspring-DEMO-neurialgrotesk-bold.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  SplashScreen.hideAsync();

  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <PaperProvider>
            <TokenSessionProvider>
              <SessionProvider>
                <Slot />
              </SessionProvider>
            </TokenSessionProvider>
          </PaperProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
