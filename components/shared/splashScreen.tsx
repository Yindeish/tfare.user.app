import { useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';


SplashScreen.preventAutoHideAsync();


export default function App() {
    const [fontsLoaded] = useFonts({
        'Neurial-Grotesk': require('./assets/fonts/Neurial-Grotesk.ttf'),
    });

    const [isReady, setReady] = useState(false);

    // useEffect(() => {
    //     setTimeout(() => {
    //         SplashScreen.hideAsync();
    //         setReady(true);
    //     }, 1000);
    // }, [isReady]);
    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
            setReady(true);
        }
    }, [fontsLoaded]);


    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    if (!isReady) {
        return <View style={{ backgroundColor: 'red', width, height }}>
            <Text>Not Ready</Text>
        </View>;
    } else {
        return <View style={{ backgroundColor: 'blue', width, height }}>
            <Text>Ready</Text>
        </View>;
    }
}
