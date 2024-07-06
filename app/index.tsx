import { View, Text, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { Redirect } from 'expo-router';
import { useSession } from '@/contexts/userTokenContext';

export default function Index() {
    const { session, isLoading } = useSession();

    const { width, height } = Dimensions.get('window');

    useEffect(() => {
        console.log({ session })
    }, [session])

    if (isLoading) {
        return <View style={{ width, height, backgroundColor: '#D7D7D7' }} />;
    }

    if (!session) {
        return <Redirect href="/introScreen" />;
    }

    else {
        return <Redirect href="/(auth)/signin" />;
    }
}