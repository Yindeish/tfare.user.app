import PaddedScreen from "@/components/shared/paddedScreen";
// import Topup from "@/components/svg/topup";
// import Wallet from "@/components/svg/wallet";
import Colors, { colors } from "@/constants/Colors";
import { fonts } from "@/constants/fonts";
import { images } from "@/constants/images";
import { useSession } from "@/contexts/userSignedInContext";
import { useSession as useTokenSession } from "@/contexts/userTokenContext";
import FetchService from "@/services/api/fetch.service";
import { useAppSelector } from "@/state/hooks/useReduxToolkit";
import AccountSelectors from "@/state/selectors/account";
import { RootState } from "@/state/store";
import { IUserAccount } from "@/state/types/account";
import { image } from "@/utils/imageStyles";
import { flex, flexCol, hFull, itemsCenter, justifyBetween, justifyCenter, wFull } from "@/utils/styles";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, ViewStyle, TextStyle } from "react-native";
import { Text } from "react-native-paper";


function UserBlock() {

    const { container, greyText, userNameText, iconImageWrapper, walletBlock, topUpBlock, topupText } = StyleSheet.create({
        container: {
            backgroundColor: colors.white,
            height: 205,
            gap: 32,
            marginTop: 40,
            marginBottom: 20
        },
        greyText: {
            color: Colors.light.textGrey,
            fontFamily: fonts.neurialGrotesk,
            fontWeight: '400',
            fontSize: 12,
        },
        userNameText: {
            color: colors.black,
            fontFamily: fonts.neurialGrotesk,
            fontWeight: '700',
            fontSize: 14,
        },
        iconImageWrapper: {
            width: 45, height: 45,
            borderColor: '#D7D7D7', borderWidth: 0.7,
            backgroundColor: '#F9F7F8',
            borderRadius: 45
        },
        walletBlock: {
            borderColor: '#D7D7D7',
            borderWidth: 0.7,
            borderRadius: 10,
            height: 112,
            paddingVertical: 17,
            paddingHorizontal: 9,
            gap: 10
        },
        topUpBlock: {
            width: 124,
            height: 45,
            borderRadius: 100,
            borderWidth: 0.7,
            borderColor: '#D7D7D7',
            paddingHorizontal: 16,
        },
        topupText: {
            fontFamily: fonts.neurialGrotesk,
            fontSize: 12,
            fontWeight: '500',
            color: colors.black
        }
    });

    const { signIn, loadingState, userSession, msg, code, signOut } = useSession();
    // const user = JSON.parse(userSession as string) as IUserAccount;
    const {user} = useAppSelector((state: RootState) => state.user);
    const { wallet } = useAppSelector((state: RootState) => state.user);

    return (
        <PaddedScreen>
            <View style={[wFull, flexCol, container as ViewStyle]}>
                <View style={[wFull, flex, justifyBetween, itemsCenter, { height: 61, }]}>
                    <View style={[flex, justifyBetween, { gap: 14 }]}>
                        <TouchableOpacity>
                            <Image
                                style={[{ width: 60, height: 60, objectFit: 'cover' }, image.rounded(60)]}
                                source={(user?.picture || user?.avatar) ? { uri: user?.picture || user?.avatar } : images.fallbackAvatar}
                            />
                        </TouchableOpacity>

                        <View style={[hFull, flexCol, justifyBetween]}>
                            <Text style={[greyText as TextStyle,]}>Welcome back</Text>
                            <Text style={[userNameText as TextStyle]}>{user?.fullName}</Text>
                            <Text style={[greyText as TextStyle]}>We are at your service</Text>
                        </View>
                    </View>

                    <View style={[flex, justifyBetween, { gap: 16, height: 45 }]}>
                        <TouchableOpacity>
                            <View style={[iconImageWrapper as ViewStyle, flex, itemsCenter, justifyCenter]}>
                                <Image style={[{ width: 18, height: 19 }]} source={images.notificationImage} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={[iconImageWrapper as ViewStyle, flex, itemsCenter, justifyCenter]}>
                                <Image style={[{ width: 23.22, height: 19 }]} source={images.headPhoneImage} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[walletBlock as ViewStyle, wFull, flex, justifyBetween, itemsCenter,]}>
                    <View style={[{ width: 126, height: 60, gap: 16 }, flexCol]}>
                        <View style={[flex, { gap: 16 }]}>
                            <Image style={[{ width: 19, height: 18 }]} source={images.walletImage} />

                            <Text style={[{ fontFamily: fonts.neurialGrotesk, fontSize: 12, color: Colors.light.textGrey, fontWeight: '400' }]}>wallet balance</Text>
                        </View>
                        <Text style={[userNameText as TextStyle, { fontSize: 22 }]}> ₦{wallet?.balance || '0000.00'}</Text>
                    </View>

                    <TouchableOpacity onPress={() => router.push('/(account)/paymentInfo')}>
                        <View style={[topUpBlock as ViewStyle, flex, itemsCenter, justifyBetween]}>

                            <Image style={[{ width: 19, height: 19 }]} source={images.topupImage} />

                            <Text style={[topupText as TextStyle]}>Top Up</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </PaddedScreen>
    )
}

export default UserBlock;