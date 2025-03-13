import { Image, TextInput, TextStyle, TouchableOpacity, View, } from 'react-native'
import { Text } from 'react-native-paper'
import React from 'react'
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

export default function Offer() {
    const dispatch = useAppDispatch()


    return (
        <SafeScreen>
            <View style={[wHFull, bg(colors.transparent), relative]}>
                <PaddedScreen>
                    <PageFloatingTitle onPress={() => {

                    }} title='Offers' color={{ icon: Colors.light.textGrey, text: colors.black }} />

                    <View style={[mt(104), wFull, bg(colors.white), rounded(10), p(10), flexCol, gap(28), py(34), px(25), { borderWidth: 0.7, borderColor: Colors.light.border, shadowColor: colors.black, shadowRadius: 12.2, }]}>

                        <View style={[flex, itemsCenter, justifyStart, gap(16), h(19.43)]}>
                            <Image style={[image.w(20.12), image.h(19.43)]} source={images.offersImage} />

                            <Text style={[neurialGrotesk, colorBlack, fw700, fs16]}>Enter Promocode</Text>
                        </View>

                        <View style={[wFull, py(20), flexCol, gap(16), { borderTopWidth: 0.7, borderTopColor: Colors.light.border, }]}>

                            <View style={[wFull, h(50), rounded(10), p(16), flex, itemsCenter, gap(10), bg('#F9F7F8')]}>

                                <TextInput
                                    style={[fs14, fw500, h(20) as TextStyle, { color: false ? Colors.light.textGrey : Colors.light.error, borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }]}
                                    keyboardType="number-pad"
                                    placeholderTextColor={Colors.light.textGrey}
                                    cursorColor={Colors.light.textGrey}
                                    placeholder="Input Code"
                                //     value={userProposedAmount?.toString()}
                                //     onChangeText={(text) => {
                                //         dispatch(setUserProposedAmount(Number(text)));
                                // }}
                                />
                            </View>
                        </View>

                        <TouchableOpacity>
                            <View style={[wFull, h(50), rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.background)]}>
                                <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>Apply</Text>

                                <Image style={[image.w(20), image.h(20)]} source={images.proceedCheckImage} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={[wFull, h(178), flexCol, gap(20), mt(32)]}>

                        <TouchableOpacity style={[bg('#F9F7F8'), flex, itemsCenter, justifyBetween, rounded(10), py(17), px(9), h(79)]}>

                            <View style={[flex, itemsCenter, gap(12)]}>
                                <View style={[w(45), h(45), bg(Colors.light.background), rounded(45), flex, itemsCenter, justifyCenter]}>
                                    <Image style={[image.w(20.12), image.h(19.43)]} source={images.blueBackgroundOfferImage} />
                                </View>

                                <View style={[flexCol, gap(12)]}>
                                    <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>Happy Eid Fitri</Text>
                                    <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>20% off your rides</Text>
                                </View>
                            </View>

                            <View style={[w(20), h(20), rounded(20), bg(colors.white), { borderWidth: 2, borderColor: Colors.light.background }]} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[bg('#F9F7F8'), flex, itemsCenter, justifyBetween, rounded(10), py(17), px(9), h(79)]}>

                            <View style={[flex, itemsCenter, gap(12)]}>
                                <View style={[w(45), h(45), bg(Colors.light.background), rounded(45), flex, itemsCenter, justifyCenter]}>
                                    <Image style={[image.w(20.12), image.h(19.43)]} source={images.blueBackgroundOfferImage} />
                                </View>

                                <View style={[flexCol, gap(12)]}>
                                    <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>Happy Eid Fitri</Text>
                                    <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>20% off your rides</Text>
                                </View>
                            </View>

                            <View style={[w(20), h(20), rounded(20), bg(colors.white), { borderWidth: 2, borderColor: Colors.light.background }]} />
                        </TouchableOpacity>
                    </View>
                </PaddedScreen>
            </View>
        </SafeScreen>
    )
}