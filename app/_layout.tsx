import { Slot, Stack } from 'expo-router';
import { SessionProvider } from '../contexts/userSignedInContext';
import { SessionProvider as TokenSessionProvider } from '../contexts/userTokenContext';
import { PaperProvider } from 'react-native-paper';
import { useFonts } from 'expo-font';
import { fonts } from '../constants/fonts';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux'
import { store } from '../state/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as SplashScreen from 'expo-splash-screen';
import { BottomSheetProvider } from '../contexts/useBottomSheetContext';
import * as Updates from 'expo-updates';
import { SnackbarProvider } from '@/contexts/snackbar.context';

export default function Root() {

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }

  useEffect(() => {
    onFetchUpdateAsync();
  }, [])


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
        {/* <BottomSheetModalProvider> */}
        <BottomSheetProvider>
          <PaperProvider>
            <SnackbarProvider>
            {/* <TokenSessionProvider> */}
              {/* <SessionProvider> */}
                <Slot />
                </SnackbarProvider>
              {/* </SessionProvider> */}
            {/* </TokenSessionProvider> */}
          </PaperProvider>
        </BottomSheetProvider>
        {/* </BottomSheetModalProvider> */}
      </GestureHandlerRootView>
    </Provider>
  );
}
