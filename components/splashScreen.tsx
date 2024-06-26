import { useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';


SplashScreen.preventAutoHideAsync();


export default function App() {
    const [isReady, setReady] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            SplashScreen.hideAsync();
            setReady(true);
        }, 1000);
    }, [isReady]);


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
