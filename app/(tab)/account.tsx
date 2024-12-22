import { Image, View, TouchableOpacity, ScrollView, Pressable, Platform, ViewStyle, TextStyle } from 'react-native'
import { ActivityIndicator, Button, Snackbar, Text } from 'react-native-paper'
import React, { useEffect } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import { image, wHFull } from '@/utils/imageStyles'
import { bg, flex, flexCenter, flexCol, gap, h, itemsCenter, justifyBetween, mb, mr, mt, pb, px, py, relative, rounded, w, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import PaddedScreen from '@/components/shared/paddedScreen'
import { images } from '@/constants/images'
import { c, colorBlack, fs12, fs14, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import { Ionicons } from '@expo/vector-icons'
import PageNavigator from '@/components/tab/account/pageNavigator'
import { pages } from '@/constants/pages'
import { Href, router } from 'expo-router'
import { useAppDispatch, useAppSelector } from '@/state/hooks/useReduxToolkit'
import PageTitle from '@/components/shared/pageTitle'
import { useSession } from '@/contexts/userSignedInContext'
import { useSnackbar } from '@/contexts/snackbar.context'
import { IUserAccount } from '@/state/types/account'

export default function Account() {
    const dispatch = useAppDispatch()
    const { signIn, loadingState, userSession, msg, code, signOut } = useSession();
    const { closeSnackbar, snackbarVisible } = useSnackbar();
    // const user = JSON.parse(userSession as string) as IUserAccount;
    const {user} = useAppSelector(state => state.user)

    return (
        <SafeScreen>
            <ScrollView style={[wHFull as ViewStyle, relative]}>
                <PaddedScreen>
                    <PageTitle
                        title='Account'
                        onPress={() => router.back()}
                    />

                    <View style={[wFull, flexCol, gap(32),]}>

                        <TouchableOpacity onPress={() => router.push(`/(account)/${pages.profileInfo}` as Href)} style={[wFull, flex, itemsCenter, justifyBetween]}>
                            <View style={[flex, gap(14), itemsCenter, { flex: 0.8 }]}>
                                <Image source={(user?.picture || user?.avatar) ? { uri: user?.picture || user?.avatar } : images.fallbackAvatar} style={[image.w(60), image.h(60), image.rounded(60)]} />

                                <View style={[flexCol, gap(16)]}>
                                    <Text style={[c(Colors.light.textGrey), fs12, fw400, neurialGrotesk]}>Welcome back</Text>
                                    <Text style={[colorBlack, fw700, fs14]}>{user?.fullName}</Text>
                                </View>
                            </View>

                            <Ionicons style={[mr(16) as TextStyle]} name="chevron-forward" size={20} color={Colors.light.textGrey} />
                        </TouchableOpacity>

                        {/* Wallet Block */}

                        <View style={[wFull, flex, gap(10), justifyBetween, itemsCenter, bg('#EDEDFD'), rounded(10), h(94), py(17), px(9), {}]}>
                            <View style={[flexCol, gap(16), w(126), h(60)]}>

                                <View style={[flex, itemsCenter, { gap: 16 }]}>

                                    <Image style={[image.w(19), image.h(18)]} source={images.walletImage} />

                                    <Text style={[neurialGrotesk, fs12, c(Colors.light.textGrey), fw400,]}>wallet balance</Text>

                                </View>

                                <Text style={[colorBlack, fw700, { fontSize: 22 }]}> ₦{'0000.00'}</Text>
                            </View>

                            <TouchableOpacity>
                                <View style={[flex, itemsCenter, justifyBetween, w(124), h(45), px(16), rounded(100), bg(colors.white), {
                                    borderWidth: 0.7, borderColor: '#D7D7D7',
                                }]}>

                                    <Image style={[image.w(19), image.h(19)]} source={images.topupImage} />
                                    <Text style={[neurialGrotesk, fs12, fw500, colorBlack]}>Top Up</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* //!Link Tiles */}

                        <View style={[wFull, flexCol, gap(16), bg(colors.white), pb(80)]}>

                            <PageNavigator
                                title='Emergency Contacts'
                                navigate
                                page={`(account)/${pages.emergencyContacts}`}
                                source={images.emergencyContactsImage} imageStyle={[image.w(18), image.h(16.36)]} />

                            <PageNavigator
                                navigate
                                page={`(account)/${pages.savedAddresses}`}
                                title='Saved Addresses' source={images.locationImage} imageStyle={[image.w(15), image.h(20)]} />

                            <PageNavigator
                                navigate
                                page={`(account)/${pages.paymentInfo}`}
                                title='Payment Infomation' source={images.paymentCardImage} imageStyle={[image.w(18), image.h(14)]} />

                            <PageNavigator
                                navigate
                                page={`(account)/${pages.accountSecurity}`}
                                title='Account Security' source={images.securityImage} imageStyle={[image.w(18), image.h(22)]} />

                            <PageNavigator
                                navigate
                                page={`(account)/${pages.notifications}`}
                                title='Notifications' source={images.notificationImage} imageStyle={[image.w(18), image.h(19)]} />

                            <PageNavigator
                                navigate
                                page={`(account)/${pages.contactSupport}`}
                                title='Contact Support' source={images.headPhoneImage} imageStyle={[image.w(18), image.h(14.73)]} />

                            <PageNavigator navigate={false} title='Rate Us' source={images.rateStarImage} imageStyle={[image.w(18), image.h(17.13)]} />

                            {loadingState === 'idle' ?
                                (<Button
                                    onPress={() => signOut()}
                                    labelStyle={[neurialGrotesk, fs14, fw500]}
                                    textColor={Colors.light.error}
                                    style={[mb(20)]}
                                >Logout</Button>)
                                :
                                (<ActivityIndicator style={[mb(20)]} color={Colors.light.background} size={'small'} />)
                            }

                            {/* Snackbar */}
                            {Platform.OS === 'ios' && <Snackbar
                                style={[]}
                                visible={snackbarVisible}
                                onDismiss={() => closeSnackbar()}
                                action={{
                                    label: 'close',
                                    onPress: () => {
                                    },
                                }}>
                                {msg}
                            </Snackbar>}
                            {/* Snackbar */}
                        </View>
                        {/* //!Link Tiles */}
                    </View>
                </PaddedScreen>
            </ScrollView>
        </SafeScreen>
    )
}

