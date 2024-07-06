import { Text, TouchableOpacity, View, Image, StyleSheet, ScrollView } from 'react-native';
import { useSession } from '../../contexts/userSignedInContext';
import { useSession as useTokenSession } from '../../contexts/userTokenContext';
import React from 'react';
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
import { router } from 'expo-router';
import { pages } from '@/constants/pages';

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
    const { signOut } = useSession();
    const { signOut: signOutToken } = useTokenSession();
    return (
        <SafeScreen>
            <ScrollView style={[wHFull, flexCol,]}>
                <UserBlock />

                <BannerBlock />

                <PaddedScreen styles={{ backgroundColor: colors.white, marginVertical: 20 }}>
                    <TouchableOpacity
                        onPress={() => router.push(`/${pages.orderRide}`)}
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
