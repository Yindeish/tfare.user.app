import { View, Text, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { Redirect } from 'expo-router';
import { useSession } from '../contexts/userTokenContext';
import { useSession as userSession } from '../contexts/userSignedInContext';
import { pages } from '../constants/pages';
import FetchService from '@/services/api/fetch.service';

export default function Index() {
    const { tokenSession, isLoading } = useSession();
    const { signOut } = userSession()

    const { width, height } = Dimensions.get('window');

    const checkUserSessionExpiry = async () => {
        const returnedData = await FetchService.getWithBearerToken({ url: '/user/me', token: tokenSession as string });
        const msg = returnedData?.msg;
        const code = returnedData?.code;

        if (msg === 'Token expired. Signin required!' && code === 401) {
            signOut();
            // <Redirect href="/(auth)/signin" />;
        }
    }

    useEffect(() => { checkUserSessionExpiry() }, []);

    useEffect(() => {
        // console.log({ tokenSession })
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
