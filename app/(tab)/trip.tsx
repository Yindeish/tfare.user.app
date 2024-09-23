import { Image, View, TouchableOpacity, ScrollView, Pressable, Platform, TextInput, Dimensions, FlatList } from 'react-native'
import { FontAwesome6 } from '@expo/vector-icons';
import { ActivityIndicator, Button, Snackbar, Text, } from 'react-native-paper'
import React, { useEffect } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import { image, imgAbsolute, wHFull } from '@/utils/imageStyles'
import { absolute, bg, borderGrey, flex, flexCenter, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, maxh, mb, ml, mr, mt, p, pb, pl, px, py, relative, rounded, w, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import PaddedScreen from '@/components/shared/paddedScreen'
import { images } from '@/constants/images'
import { c, colorBlack, fs12, fs14, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import { Href, router } from 'expo-router'
import PageTitle from '@/components/shared/pageTitle'

const { height } = Dimensions.get('window')

export default function Trip() {
    return (
        <SafeScreen>
            {/* <ScrollView style={[wHFull, relative]}> */}
            <PaddedScreen>
                <PageTitle
                    title='Trips'
                    onPress={() => router.back()}
                />


                <View style={[flexCol, gap(32),]}>
                    {/* //!Search Block */}
                    <View style={[wFull, rounded('100%'), bg(colors.transparent), h(50), relative]}>
                        {/* //! */}
                        <Image style={[image.w(20), image.h(20), imgAbsolute, image.t('30%'), image.l(20), image.zIndex(3)]} source={images.search} />
                        {/* //! */}

                        <TextInput
                            style={[
                                wHFull, pl(43), borderGrey(0.7), rounded(50), bg('#F9F7F8')
                            ]}
                            placeholder='Search Bus stop'
                            placeholderTextColor={Colors.light.textGrey}
                            value={''}
                            onChangeText={() => { }}

                        />
                    </View>
                    {/* //!Search Block */}

                    <ScrollView style={[flexCol, gap(40), h(height * 1),]}>
                        {/* //!Rides Based On Date Block */}
                        <View style={[flexCol, gap(24), mb(24), { flexBasis: '50%', }]}>
                            {/* //!Date and Filter */}
                            <View style={[flex, justifyBetween, itemsCenter]}>
                                <Text style={[neurialGrotesk, fw700, fs14, c(colors.black)]}>Today</Text>

                                <TouchableOpacity>
                                    <Image style={[image.w(18), image.h(18)]} source={images.settings} />
                                </TouchableOpacity>
                            </View>
                            {/* //!Date and Filter */}

                            <View style={[flexCol, gap(24),]}>
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <View style={[bg('#F9F7F8'), wFull, rounded(10), py(17), px(9), flexCol, gap(20)]}
                                        key={index}>

                                        <View style={[flex, justifyBetween, itemsCenter]}>
                                            <Text style={[fw700, fs14, c(colors.black)]}>Bus Stop A</Text>

                                            <Image style={[image.w(90), image.h(5)]} source={images.tripDirection} />

                                            <Text style={[fw700, fs14, c(colors.black)]}>Bus Stop B</Text>
                                        </View>

                                        <View style={[wFull, flex, justifyBetween, itemsCenter]}>
                                            <View style={[flexCol, gap(16)]}>
                                                <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>7:30 AM</Text>
                                                <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>Apr 14</Text>
                                            </View>

                                            <View style={[flex]}>
                                                <View style={[w('auto'), h(45), rounded(100), flex, itemsCenter, gap(16), bg(colors.white), p(16), { borderWidth: 0.7, borderColor: Colors.light.border }]}>
                                                    <Image style={[image.w(18), image.h(14.73)]} source={images.passengersImage} />
                                                    <Text style={[fs12, fw500, colorBlack]}>{3} seats Available</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => router.push(`/(tripScreen)/tripDetails/${index}` as Href)} style={[w(45), h(45), bg('#5D5FEF'), rounded('100%'), flex, itemsCenter, justifyCenter, ml(-15)]}>
                                                    <FontAwesome6 name="arrow-right-long" size={24} color={colors.white} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                    </View>
                                ))}
                            </View>
                        </View>
                        {/* //!Rides Based On Date Block */}

                        {/* //!Rides Based On Date Block */}
                        <View style={[flexCol, gap(24), mb(height * 0.4), { flexBasis: '50%', }]}>
                            {/* //!Date and Filter */}
                            <View style={[flex, justifyBetween, itemsCenter]}>
                                <Text style={[neurialGrotesk, fw700, fs14, c(colors.black)]}>Tomorrow</Text>

                                <TouchableOpacity>
                                    <Image style={[image.w(18), image.h(18)]} source={images.settings} />
                                </TouchableOpacity>
                            </View>
                            {/* //!Date and Filter */}

                            <View style={[flexCol, gap(24),]}>
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <View style={[bg('#F9F7F8'), wFull, rounded(10), py(17), px(9), flexCol, gap(20)]}
                                        key={index}>

                                        <View style={[flex, justifyBetween, itemsCenter]}>
                                            <Text style={[fw700, fs14, c(colors.black)]}>Bus Stop A</Text>

                                            <Image style={[image.w(90), image.h(5)]} source={images.tripDirection} />

                                            <Text style={[fw700, fs14, c(colors.black)]}>Bus Stop B</Text>
                                        </View>

                                        <View style={[wFull, flex, justifyBetween, itemsCenter]}>
                                            <View style={[flexCol, gap(16)]}>
                                                <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>7:30 AM</Text>
                                                <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>Apr 14</Text>
                                            </View>

                                            <View style={[flex]}>
                                                <View style={[w('auto'), h(45), rounded(100), flex, itemsCenter, gap(16), bg(colors.white), p(16), { borderWidth: 0.7, borderColor: Colors.light.border }]}>
                                                    <Image style={[image.w(18), image.h(14.73)]} source={images.passengersImage} />
                                                    <Text style={[fs12, fw500, colorBlack]}>{3} seats Available</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => router.push(`/(tripScreen)/tripDetails/${index}` as Href)} style={[w(45), h(45), bg('#5D5FEF'), rounded('100%'), flex, itemsCenter, justifyCenter, ml(-15)]}>
                                                    <FontAwesome6 name="arrow-right-long" size={24} color={colors.white} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                    </View>
                                ))}
                            </View>
                        </View>
                        {/* //!Rides Based On Date Block */}

                    </ScrollView>
                </View>

            </PaddedScreen>
            {/* </ScrollView> */}
        </SafeScreen>
    )
}