import { View, Text, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { Redirect } from 'expo-router';
import { useSession } from '@/contexts/userTokenContext';

export default function index() {
    const { session, isLoading } = useSession();

    const { width, height } = Dimensions.get('window');

    useEffect(() => {
        console.log({ session })
    }, [session])

    if (isLoading) {
        // return <View style={{ width, height, backgroundColor: '#D8D8D8' }} />;
        return <View style={{ width, height, backgroundColor: 'red' }} />;
    }

    if (!session) {
        return <Redirect href="/introScreen" />;
    }

    else {
        return <Redirect href="/(auth)/signin" />;
    }

    // return (
    //     <View>
    //         <Text>index</Text>
    //     </View>
    // )
}