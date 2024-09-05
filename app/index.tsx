import { View, Text, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { Redirect } from 'expo-router';
import { useSession } from '../contexts/userTokenContext';
import { pages } from '../constants/pages';

export default function Index() {
    const { tokenSession, isLoading } = useSession();

    const { width, height } = Dimensions.get('window');

    useEffect(() => {
        console.log({ tokenSession })
    }, [tokenSession])

    if (isLoading) {
        return <View style={{ width, height, backgroundColor: '#D7D7D7' }} />;
    }

    if (!tokenSession) {
        return <Redirect href="/introScreen" />;
    }

    else {
        return <Redirect href="/(auth)/signin" />; // uncomment after testing
        // return <Redirect href={`/(rideScreens)/1/${pages.tripHistory}`} />; // part of testing
        // return <Redirect href={`/(rideScreens)/${pages.tripHistory}`} />; // part of testing

    }
}
