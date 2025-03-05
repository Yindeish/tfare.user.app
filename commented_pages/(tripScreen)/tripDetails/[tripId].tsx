import { Image, View, TouchableOpacity, ScrollView, Pressable, Platform, TextInput, Dimensions, FlatList } from 'react-native'
import { FontAwesome6 } from '@expo/vector-icons';
import { ActivityIndicator, Button, Snackbar, Text, } from 'react-native-paper'
import React, { useEffect } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import { image, imgAbsolute, mYAuto, wHFull } from '@/utils/imageStyles'
import { absolute, bg, borderGrey, borderL, borderR, flex, flexCenter, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, maxh, mb, ml, mr, mt, my, p, pb, pl, px, py, relative, rounded, w, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import PaddedScreen from '@/components/shared/paddedScreen'
import { images } from '@/constants/images'
import { c, colorBlack, fs12, fs14, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import { Href, router } from 'expo-router'
import PageTitle from '@/components/shared/pageTitle'
import TripBlock from '@/components/shared/tripBlock';
import InTripDropoffTile from '@/components/page/inTripDropoffsTile';
import CtaBtn from '@/components/shared/ctaBtn';
import { useBottomSheet } from '@/contexts/useBottomSheetContext';
import BookSeatSheet from '@/components/page/bookSeatSheet';

const { height } = Dimensions.get('window')

function TripDetails() {
    const { showBottomSheet } = useBottomSheet()


    return (
        <SafeScreen>
            <ScrollView style={[]}>
                {/* //!Page Header */}
                <PaddedScreen>
                    <View style={[flex, justifyBetween, itemsCenter, w('100%'),]}>
                        <View style={[w('auto'), mYAuto]}>
                            <PageTitle
                                title='Trip Details'
                                onPress={() => router.back()}
                            />
                        </View>

                        <TouchableOpacity onPress={() => router.push(`/(sharedScreens)/driverProfile/1` as Href)} style={[bg('#F9F7F8'), borderGrey(0.7), rounded(10), py(0), px(10), flex, gap(10), itemsCenter, w('auto'), h(45), mt(20)]}>
                            <Image style={[image.w(30), image.h(30), image.rounded(30)]} source={images.userProfileImage} />

                            <Text style={[neurialGrotesk, fs12, fw500, c(colors.black)]}>View Driver</Text>
                        </TouchableOpacity>
                    </View>
                </PaddedScreen>
                {/* //!Page Header */}

                {/* //!Trip Block */}
                <TripBlock />
                {/* //!Trip Block */}

                <PaddedScreen>
                    {/* //!In Trip Dropoffs */}
                    <View style={[flexCol, gap(16), mt(32)]}>
                        <Text style={[fw700, fs14, c(colors.black)]}>In-Trip Dropoffs</Text>

                        {/* <View style={[flexCol, gap(16), bg('red'), h(height * 0.51), { overflow: 'scroll' }]}> */}
                        <View style={[flexCol, gap(16), { overflow: 'scroll' }]}>
                            {Array.from({ length: 7 }).map((_, index) => (
                                <InTripDropoffTile
                                    key={index}
                                />
                            ))}
                        </View>

                    </View>
                    {/* //!In Trip Dropoffs */}
                </PaddedScreen>

                <CtaBtn
                    img={{ src: images.whiteBgTripImage, w: 20, h: 20 }}
                    onPress={() => showBottomSheet([700], <BookSeatSheet />)}
                    text={{ name: 'Book Seat', color: colors.white }}
                    bg={{ color: Colors.light.background }}
                    style={{ container: { width: '90%', marginLeft: '5%', marginTop: 10, marginBottom: 30 } }}
                />
            </ScrollView>
        </SafeScreen>
    )
}

export default TripDetails;