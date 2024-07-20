import { View, Text, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { Redirect } from 'expo-router';
import { useSession } from '@/contexts/userTokenContext';

export default function Index() {
    const { tokenSession, isLoading, } = useSession();

    const { width, height } = Dimensions.get('window');

    if (isLoading) {
        return <View style={{ width, height, backgroundColor: '#D7D7D7' }} />;
    }

    if (!tokenSession) {
        return <Redirect href="/introScreen" />;
    }

    else {
        return <Redirect href="/(auth)/signin" />;

    }
}
