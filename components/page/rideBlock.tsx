import React, { useEffect, useRef, useState } from 'react';
import { absolute, bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, justifyStart, l, left0, mXAuto, mb, p, px, py, relative, rounded, t, top0, w, wFull, wHFull, zIndex } from "@/utils/styles";
import { View, Text, TouchableOpacity, Button, Dimensions, ScrollView, Image, FlatList } from "react-native";
import Colors, { colors } from '@/constants/Colors';
import { c, colorBlack, colorWhite, fs12, fs14, fs16, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles';
import { images } from '@/constants/images';
import { image } from '@/utils/imageStyles';
import { pages } from '@/constants/pages';
import { FontAwesome6 } from '@expo/vector-icons';
import { IRide } from '@/state/types/ride';

const RideBlock = ({ bgColor, ctaType, roundedCorners, ride, onPress, touchable }: { ctaType: 'trackRide' | 'bookRide', bgColor: '#F9F7F8' | '#FFF7E6', roundedCorners: boolean, ride?: IRide, onPress?: () => void, touchable?: boolean }) => (
    <View style={[wFull, h(144), roundedCorners && rounded(10), py(17), px(9), flexCol, gap(10), bg(bgColor), ctaType === 'bookRide' && mb(20)]}>

        <View style={[wFull, h(45), flex, itemsCenter, justifyBetween, gap(14)]}>
            <View style={[flexCol, gap(12), itemsStart]}>
                <Text style={[colorBlack, fw700, fs14]}>Rider #{ride?.id}</Text>
                <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey)]}>Honda Accord</Text>
            </View>

            <View style={[w('auto'), h(45), rounded(100), flex, itemsCenter, gap(16), bg(colors.white), p(16), { borderWidth: 0.7, borderColor: Colors.light.border }]}>
                <Image style={[image.w(18), image.h(14.73)]} source={images.passengersImage} />
                <Text style={[fs12, fw500, colorBlack]}>{ride?.availableSeats} seats Available</Text>
            </View>
        </View>

        <View style={[wFull, h(45), flex, itemsCenter, justifyBetween, gap(49)]}>
            <View style={[h(18), flex, itemsCenter, gap(4)]}>
                <View style={[hFull, flex, itemsCenter, gap(12)]}>
                    <Image style={[image.w(20), image.h(18)]} source={images.recentImage} />
                    <Text style={[c(Colors.light.textGrey), neurialGrotesk, fw400, fs12]}>ETA</Text>
                </View>

                <View style={[hFull, flex, itemsCenter, gap(12)]}>
                    <View style={[image.w(5), image.h(5), rounded(5), bg(colors.black)]} />
                    <Text style={[colorBlack, neurialGrotesk, fw500, fs14]}>{ride?.duration}</Text>
                </View>
            </View>

            <View style={[flex, itemsCenter, gap(12)]}>
                <Text style={[colorBlack, neurialGrotesk, fw700, fs14]}>{ctaType === 'bookRide' ? 'Book Ride' : 'Track Ride'}</Text>

                {touchable ? (<TouchableOpacity
                    onPress={onPress}
                    style={[w(45), h(45), rounded(45), bg(Colors.light.background), flex, itemsCenter, justifyCenter, { borderWidth: 0.7, borderColor: Colors.light.border }]}>
                    {ctaType === 'bookRide' ?
                        (<FontAwesome6 name="arrow-right-long" size={24} color={colors.white} />)
                        :
                        (<Image style={[image.w(22), image.h(22),]} source={images.blueBgPickupImage} />)
                    }
                </TouchableOpacity>)
                    :
                    (<View
                        style={[w(45), h(45), rounded(45), bg(Colors.light.background), flex, itemsCenter, justifyCenter, { borderWidth: 0.7, borderColor: Colors.light.border }]}>
                        {ctaType === 'bookRide' ?
                            (<FontAwesome6 name="arrow-right-long" size={24} color={colors.white} />)
                            :
                            (<Image style={[image.w(22), image.h(22),]} source={images.blueBgPickupImage} />)
                        }
                    </View>)}
            </View>
        </View>
    </View>
)

export default RideBlock;