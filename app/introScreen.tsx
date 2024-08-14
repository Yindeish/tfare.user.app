import { View, StyleSheet, Pressable, } from 'react-native'
import { Text, Button, TouchableRipple, MD2Colors } from 'react-native-paper';
import React, { useEffect, useState } from 'react'
import Swiper from 'react-native-swiper'
import { Link, router } from 'expo-router';
import { images } from '@/constants/images';
import Colors, { colors } from '@/constants/Colors';
import { fonts } from '@/constants/fonts';
import SafeScreen from '@/components/shared/safeScreen';
import { bg, flex, flexCol, itemsCenter, justifyCenter, w, wFull, wHFull } from '@/utils/styles';
import { colorWhite, fs14, fs18, fw400, fw700, neurialGrotesk } from '@/utils/fontStyles';
import { pages } from '@/constants/pages';
import { Image } from 'expo-image';

const { container, containerWrapper, skipLink, skipText, slide, slideImage, slideText, text, wrapper, activeDotStyle, ctaBtn, ctaText } = StyleSheet.create({
    containerWrapper: {
        backgroundColor: Colors.light.background,
    },
    skipLink: {
        marginLeft: 'auto',
        marginRight: 20,
        marginTop: 102,
    },
    skipText: {
        lineHeight: 17,
    },
    container: {
        width: '100%',
        paddingHorizontal: 20,
        height: '60%',
        backgroundColor: colors.transparent,
        marginBottom: 30
    },
    wrapper: {
    },
    slide: {
        backgroundColor: colors.transparent,
        gap: 15
    },
    slideImage: {
        height: '55%', objectFit: 'cover'
    },
    slideText: {
        fontSize: 22,
        lineHeight: 22,
        textAlign: 'center',
        color: 'white'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: fonts.neurialGrotesk
    },
    activeDotStyle: {
        width: 14,
        height: 7,
        borderRadius: 10
    },
    ctaBtn: {
        borderRadius: 10,
        backgroundColor: Colors.light.tabIconDefault,
        height: 50
    },
    ctaText: {

    }
});

export default function IntroScreen() {

    let [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    return (
        <SafeScreen>
            <View style={[wHFull, flexCol, itemsCenter, containerWrapper]}>

                <Link
                    href={'/(auth)/signin'}
                    style={skipLink}
                >
                    <Text style={[skipText, colorWhite, fw400, fs14]}>Skip</Text>
                </Link>

                <View style={container}>
                    <Swiper
                        style={wrapper}
                        showsButtons={false}
                        dotColor='white'
                        activeDotColor='#EF5DA8'
                        activeDotStyle={activeDotStyle}
                        scrollEnabled={true}
                        index={0}
                        autoplay
                        autoplayTimeout={1}
                        loop={false}
                        onIndexChanged={(index) => {
                            setCurrentSlideIndex(index);
                        }}
                    >
                        <View style={[slide, wHFull, itemsCenter, justifyCenter]}>
                            <Image style={[slideImage as any, wFull]} source={images.introScreenImage1} />

                            <Text style={slideText}>
                                Unlock a new way to travel with loved ones through our Family Ride feature.
                            </Text>
                        </View>
                        <View style={[slide, wHFull, itemsCenter, justifyCenter]}>
                            <Image style={[slideImage as any, wFull]} source={images.introScreenImage2} />

                            <Text style={slideText}>
                                Experience the freedom of safe travels.
                            </Text>
                        </View>
                        <View style={[slide, wHFull, itemsCenter, justifyCenter]}>
                            <Image style={[slideImage as any, wFull]} source={images.introScreenImage3} />

                            <Text style={slideText}>
                                Discover the joy of shared experiences with our Co-Passenger rides.
                            </Text>
                        </View>
                    </Swiper>
                </View>

                {currentSlideIndex === 2 ?
                    (<View style={[currentSlideIndex === 2 && flexCol, wFull, {
                        opacity: currentSlideIndex === 2 ? 1 : 0, gap: 16, paddingHorizontal: 20, display: currentSlideIndex === 2 ? 'flex' : 'none'
                    }]}>
                        <TouchableRipple onPress={() => router.replace(`/(auth)/${pages.signup}`)} rippleColor={Colors.light.tabIconDefault} style={[ctaBtn, flexCol, wFull, itemsCenter, justifyCenter]}>
                            <Text style={[fw700, fs18, colorWhite, neurialGrotesk,]}>Get Started</Text>
                        </TouchableRipple>

                        <TouchableRipple
                            onPress={() => router.replace(`/(auth)/${pages.signin}`)} rippleColor={colors.white} style={[ctaBtn, flexCol, wFull, itemsCenter, justifyCenter, { backgroundColor: MD2Colors.transparent, borderWidth: 1, borderColor: MD2Colors.white }]}>
                            <Text style={[fw700, fs18, colorWhite, neurialGrotesk,]}>Sign in</Text>
                        </TouchableRipple>
                    </View>)
                    :
                    (<View style={[wFull, bg('transparent'), { flex: 1 }]} />)}
            </View>
        </SafeScreen>
    )
}