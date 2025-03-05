import { Image, TextInput, TouchableOpacity, View, } from 'react-native'
import { Text } from 'react-native-paper'
import React, { useEffect } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import { bg, flex, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, justifyStart, ml, mt, p, pt, px, py, relative, rounded, w, wFull, wHFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons';
import { c, colorBlack, colorWhite, fs12, fs14, fs16, fs18, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import PaddedScreen from '@/components/shared/paddedScreen'
import { image } from '@/utils/imageStyles'
import { images } from '@/constants/images'
import { useAppDispatch } from '@/state/hooks/useReduxToolkit'
import PageFloatingTitle from '@/components/page/pageFloatingTitle'
import PageTitle from '@/components/shared/pageTitle'
import PaymentOptionsListTile from '@/components/page/paymentOptionsListTile'
import CtaBtn from '@/components/shared/ctaBtn'
import { Href, router, useLocalSearchParams } from 'expo-router'
import { pages } from '@/constants/pages'
import { openBottomSheet, setBottomSheetSnapPoint, setBottomSheetType } from '@/state/slices/layout'
import LayoutSelectors from '@/state/selectors/layout'
import { useBottomSheet } from '@/contexts/useBottomSheetContext'
import { RideBookedSheet } from '@/components/page/bookRideSheetComponent'


export default function PaymentOptions() {
    const dispatch = useAppDispatch()
    const { rideId } = useLocalSearchParams();
    const { showBottomSheet } = useBottomSheet()


    return (
        <SafeScreen>
            <View style={[wHFull, bg(colors.transparent), relative]}>
                <PaddedScreen>
                    <PageTitle title='Pay with' />

                    <View style={[wFull, flexCol, gap(24)]}>

                        <PaymentOptionsListTile
                            input={{
                                onChange: (val: string) => {

                                },
                                value: 'waLLet'
                            }}
                            title='Wallet'
                            subTitle={`Balance: ₦${'0000.00'}`}
                        />

                        <PaymentOptionsListTile
                            input={{
                                onChange: (val: string) => {

                                },
                                value: 'waLLet'
                            }}
                            title='Cash'
                            subTitle={`Pay driver with cash`}
                        />

                        <PaymentOptionsListTile
                            input={{
                                onChange: (val: string) => {

                                },
                                value: 'waLLet'
                            }}
                            title='Pay online'
                            subTitle={`Pay with third party`}
                        />
                    </View>

                    <View style={[wFull, mt('97%')]}>
                        <CtaBtn
                            img={{ src: images.proceedCheckImage, w: 20, h: 20 }}
                            onPress={() => {
                                router.push(`/(tripScreen)/bookTrip/1` as Href);
                                showBottomSheet([800], <RideBookedSheet rideId={rideId as string} />)
                            }}
                            text={{ name: 'Proceed', color: colors.white }}
                            bg={{ color: Colors.light.background }}
                        />
                    </View>
                </PaddedScreen>
            </View>
        </SafeScreen>
    )
}