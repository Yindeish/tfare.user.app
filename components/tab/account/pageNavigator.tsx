import { Image, View, TouchableOpacity, ImageSourcePropType, ImageStyle } from 'react-native'
import { Text } from 'react-native-paper'
import React from 'react'
import { image, wHFull } from '@/utils/imageStyles'
import { bg, flex, flexCenter, flexCol, gap, h, itemsCenter, justifyBetween, mr, mt, px, py, relative, rounded, w, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import { images } from '@/constants/images'
import { c, colorBlack, fs12, fs14, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Href } from 'expo-router'


function PageNavigator({ title, source, imageStyle, page, navigate }: { title: string, source: ImageSourcePropType, imageStyle?: ImageStyle | ImageStyle[], page?: string, navigate?: boolean }) {


    return (
        <TouchableOpacity onPress={() => navigate && router.push(`/${page}` as Href)} style={[bg('#F9F7F8'), wFull, h(50), px(24), rounded(10), flex, itemsCenter, gap(10), justifyBetween]}>

            <View style={[flex, itemsCenter, gap(16), { flex: 0.8 }]}>
                <Image source={source} style={imageStyle} />

                <Text style={[neurialGrotesk, fw500, fs14, colorBlack]}>{title}</Text>
            </View>

            <Ionicons style={[mr(16)]} name="chevron-forward" size={20} color={Colors.light.textGrey} />
        </TouchableOpacity>
    )
}

export default PageNavigator;