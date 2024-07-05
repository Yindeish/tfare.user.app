

import { Image, ScrollView, StyleSheet, TextStyle, TouchableOpacity, View, } from 'react-native'
import { Text } from 'react-native-paper'
import React from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import { bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, justifyStart, mb, mt, p, pr, px, py, relative, rounded, w, wFull, wHFull } from '@/utils/styles'
import PageFloatingTitle from '@/components/page/pageFloatingTitle'
import { router } from 'expo-router'
import Colors, { colors } from '@/constants/Colors'
import { c, colorBlack, colorWhite, fs12, fs14, fs18, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import { image } from '@/utils/imageStyles'
import { images } from '@/constants/images'
import { FontAwesome6 } from '@expo/vector-icons'
import { pages } from '@/constants/pages'
import RideBlock from '@/components/page/rideBlock'
import PaddedScreen from '@/components/shared/paddedScreen'
import { FlatList } from 'react-native-gesture-handler'
import RideSelectors from '@/state/selectors/ride'

const { sharedStyle, availableSeatStyle, selectedSeatStyle, unavailableSeatStyle } = StyleSheet.create({
    sharedStyle: {
        ...w(45), ...h(45), ...rounded(100), ...p(16), ...flex, ...itemsCenter, ...justifyCenter,
        borderWidth: 0.7, borderColor: Colors.light.border
    },
    availableSeatStyle: {
        ...bg('#F9F7F8'),
    },
    unavailableSeatStyle: {
        ...bg(Colors.light.border)
    },
    selectedSeatStyle: {
        ...bg(Colors.light.background)
    }
});

export default function BookRide() {
    const { pickupBusstopInput, dropoffBusstopInput } = RideSelectors()

    const DATA = [{
        id: 0,
        name: ''
    }, {
        id: 1,
        name: ''
    }, {
        id: 2,
        name: ''
    }, {
        id: 3,
        name: ''
    },
        //     {
        //     id: 4,
        //     name: ''
        // }, {
        //     id: 5,
        //     name: ''
        // }, {
        //     id: 6,
        //     name: ''
        // }, {
        //     id: 7,
        //     name: ''
        //     }
    ]

    return (
        <SafeScreen>
            <View style={[relative]}>

                {/* Page Title */}
                <PageFloatingTitle
                    title='Book Ride'
                    color={{ icon: Colors.light.textGrey, text: colors.black }}
                    onPress={() => router.back()}
                    view={false}
                />
                {/* Page Title */}

                <ScrollView >
                    <View style={[wHFull, mt(120), flexCol, gap(32), mb(32)]}>

                        <RideBlock
                            bgColor='#FFF7E6'
                            ctaType='trackRide'
                            touchable
                            roundedCorners={false}
                            onPress={() => { }}
                        />

                        <PaddedScreen>
                            <View style={[wFull, h(99), flexCol, gap(16), { borderBottomColor: Colors.light.border, borderBottomWidth: 0.7 }]}>
                                <View style={[wFull, flex, itemsCenter, gap(12)]}>
                                    <Image style={[image.w(20), image.h(13)]} source={images.ticketImage} />

                                    <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey)]}>Tickets</Text>
                                </View>

                                <FlatList
                                    data={DATA}
                                    horizontal
                                    renderItem={({ item: { id } }) => (
                                        <TouchableOpacity style={[sharedStyle, id === 2 ? selectedSeatStyle : id === 4 ? unavailableSeatStyle : availableSeatStyle]} key={id}>
                                            <Text style={[neurialGrotesk, fw400, fs14, { color: `${id === 2 ? colors.white : colors.black}` }]}>{id + 1}</Text>
                                        </TouchableOpacity>
                                    )}
                                    ItemSeparatorComponent={() => (<View style={[w(24)]} />)}
                                    keyExtractor={({ id }) => id.toString()}
                                />
                            </View>

                            <FlatList
                                data={['', '']}
                                renderItem={({ item, index }) => (
                                    <View style={[wFull, flexCol, gap(32), mt(32)]}>
                                        <Text style={[colorBlack, neurialGrotesk, fw700, fs14]}>Ticket {index}</Text>

                                        {/* Pick up block */}

                                        <View style={[wFull, flexCol, gap(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>
                                            <View style={[flexCol, gap(15)]}>
                                                <View style={[flex, gap(12), itemsCenter]}>
                                                    <Image source={images.greenBgCoasterImage} style={[image.w(20), image.h(20)]} />

                                                    <Text style={[c(Colors.light.border), neurialGrotesk, fw400, fs12]}>Pick up Bus Stop</Text>
                                                </View>

                                                <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{pickupBusstopInput}</Text>
                                            </View>
                                        </View>

                                        {/* Pick up block */}
                                        {/* Drop off block */}

                                        <View style={[wFull, flex, justifyBetween, pr(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>
                                            <View style={[flexCol, gap(15)]}>
                                                <View style={[flex, gap(12), itemsCenter]}>
                                                    <Image source={images.redBgCoasterImage} style={[image.w(20), image.h(20)]} />

                                                    <Text style={[c(Colors.light.border), neurialGrotesk, fw400, fs12]}>Pick up Bus Stop</Text>
                                                </View>

                                                <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{pickupBusstopInput}</Text>
                                            </View>

                                            <View style={[flexCol, gap(16), justifyStart]}>
                                                <View style={[flex, itemsCenter, gap(8)]}>
                                                    <Image style={[image.w(14), image.h(11)]} source={images.rideOfferImage} />
                                                    <Text style={[c(Colors.light.textGrey), neurialGrotesk, fw400, fs12]}>Ticket fee</Text>
                                                </View>

                                                <Text style={[colorBlack, fw700, fs14, neurialGrotesk]}> ₦ 550.00</Text>
                                            </View>
                                        </View>
                                        {/* Drop off block */}

                                    </View>
                                )}
                                ItemSeparatorComponent={() => (
                                    <View style={[wFull, h(32)]} />
                                )}
                            />

                            <TouchableOpacity onPress={() => { }}>
                                <View style={[w('50%'), h(50), mt(32), rounded(100), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.background)]}>
                                    <Image style={[image.w(20), image.h(20)]} source={images.waitChairImage} />

                                    <Text style={[neurialGrotesk, fw500, fs12, colorWhite]}>Add another ticket</Text>
                                </View>
                            </TouchableOpacity>

                        </PaddedScreen>
                    </View>
                </ScrollView>
            </View>
        </SafeScreen>
    )
}
