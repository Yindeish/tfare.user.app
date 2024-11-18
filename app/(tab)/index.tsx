import { Text, TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import SafeScreen from '@/components/shared/safeScreen';
import { flex, flexCol, itemsCenter, justifyCenter, wFull, wHFull } from '@/utils/styles';
import Colors, { colors } from '@/constants/Colors';
import UserBlock from '@/components/tab/home/userBlock';
import BannerBlock from '@/components/tab/home/bannerBlock';
import PaddedScreen from '@/components/shared/paddedScreen';
import { images } from '@/constants/images';
import { fonts } from '@/constants/fonts';
import TripHistory from '@/components/tab/home/TripHistory';
import { colorWhite, fs12, fw500, neurialGrotesk } from '@/utils/fontStyles';
import { pages } from '@/constants/pages';
import { Href, router } from 'expo-router';
import { Image } from 'expo-image';
import FetchService from '@/services/api/fetch.service';
import { useSession } from '@/contexts/userTokenContext';
import { RefreshControl } from 'react-native-gesture-handler';
import { setUserWallet } from '@/state/slices/account';
import { setInputState, setWalletState } from '@/state/slices/user';
import { useAppDispatch } from '@/state/hooks/useReduxToolkit';

const { orderRideBtn, orderRideText } = StyleSheet.create({
    orderRideBtn: {
        backgroundColor: Colors.light.background,
        height: 50,
        borderRadius: 10,
        gap: 10
    },
    orderRideText: {
        fontFamily: fonts.neurialGrotesk,
        fontWeight: '500',
        fontSize: 12,
        color: colors.white
    }
});

export default function Index() {
    const dispatch = useAppDispatch();
    const { tokenSession } = useSession()

    const [fetchState, setFetchState] = useState({
        loading: false,
    })
    const { loading } = fetchState;

    const getUserWallet = async () => {
        setFetchState({ loading: true });
        const returnedData = await FetchService.getWithBearerToken({ url: '/user/me', token: tokenSession as string });
        const wallet = returnedData?.wallet;
        setFetchState({ loading: false });
        if (wallet) {
            const { account_number, account_status,
                balance, bank_name, expiry_date,
                note, userId } = wallet;
            dispatch(setWalletState({
                key: 'balance', value: balance
            }))
        }
    }


    useEffect(() => {
        getUserWallet();
    }, [])

    return (
        <SafeScreen>
            <ScrollView bounces style={[wHFull, flexCol,]} refreshControl={<RefreshControl refreshing={loading} onRefresh={getUserWallet} />}>
                <UserBlock />

                <BannerBlock />

                <PaddedScreen styles={{ backgroundColor: colors.white, marginVertical: 20 }}>
                    <TouchableOpacity
                        onPress={() => {
                            router.push(`/${pages.orderRide}` as Href);
                        }}
                        style={[orderRideBtn, wFull, flex, itemsCenter, justifyCenter]}>
                        <Image style={{ width: 20, height: 17.27 }} source={images.whiteTripImage} />

                        <Text style={[neurialGrotesk, fw500, fs12, colorWhite]}>Order Ride</Text>
                    </TouchableOpacity>

                    <TripHistory />
                </PaddedScreen>

            </ScrollView>
        </SafeScreen>
    );
}
