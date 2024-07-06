import { Image, View, } from 'react-native'
import { Text } from 'react-native-paper'
import React from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import { image, wHFull } from '@/utils/imageStyles'
import PageFloatingTitle from '@/components/page/pageFloatingTitle'
import { flex, flexCenter, flexCol, gap, itemsCenter, justifyBetween, mr, relative, rounded, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import PaddedScreen from '@/components/shared/paddedScreen'
import { images } from '@/constants/images'
import { c, colorBlack, fs12, fs14, fw400, fw700, neurialGrotesk } from '@/utils/fontStyles'
import { Ionicons } from '@expo/vector-icons'

export default function Account() {
    return (
        <SafeScreen>
            <View style={[wHFull, relative]}>

                <PageFloatingTitle
                    title='Account'
                    color={{ icon: Colors.light.textGrey, text: colors.black }}
                    onPress={() => { }} />

                <PaddedScreen>
                    <View style={[wFull, flexCenter, gap(32),]}>

                        <View style={[wFull, flex, itemsCenter, justifyBetween]}>
                            <View style={[flex, gap(14), itemsCenter, { flex: 0.8 }]}>
                                <Image source={images.userProfileImage} style={[image.w(60), image.h(60),]} />

                                <View style={[flexCol, gap(16)]}>
                                    <Text style={[c(Colors.light.textGrey), fs12, fw400, neurialGrotesk]}>Welcome back</Text>
                                    <Text style={[colorBlack, neurialGrotesk, fw700, fs14]}>King John</Text>
                                </View>
                            </View>

                            <Ionicons style={[mr(16)]} name="chevron-back" size={20} color={Colors.light.textGrey} />
                        </View>
                    </View>
                </PaddedScreen>
            </View>
        </SafeScreen>
    )
}