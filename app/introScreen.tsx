import { View, StyleSheet, Pressable, Image } from 'react-native'
import { Text, Button, TouchableRipple, MD2Colors } from 'react-native-paper';
import React, { useState } from 'react'
import Swiper from 'react-native-swiper'
import { useSession } from '@/contexts/userSignedInContext';
import { Link } from 'expo-router';
import { images } from '@/constants/images';
import Colors from '@/constants/Colors';
import { fonts } from '@/constants/fonts';
import SafeScreen from '@/components/safeScreen';
import PaddedScreen from '@/components/paddedScreen';

const { container, containerWrapper, skipLink, skipText, slide, slideImage, slideText, text, wrapper, activeDotStyle, ctaBtn, ctaText } = StyleSheet.create({
    containerWrapper: {
        backgroundColor: '#5D5FEF',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    skipLink: {
        marginLeft: 'auto',
        marginRight: '5%'
    },
    skipText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 17,
    },
    container: {
        width: '90%',
        height: '60%',
        backgroundColor: 'transparent',
        marginBottom: 30
    },
    wrapper: {
    },
    slide: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        gap: 15
    },
    slideImage: {
        width: '100%', height: '55%', objectFit: 'cover'
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: Colors.light.tabIconDefault,
        height: 50
    },
    ctaText: {
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 23.76,
        color: MD2Colors.white,
        fontFamily: fonts.neurialGrotesk
    }
});

export default function IntroScreen() {

    const { signIn } = useSession();
    let [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    return (
        <SafeScreen>
            <PaddedScreen>
                <View style={containerWrapper}>

                    <Link
                        href={'/(auth)/signin'}
                        style={skipLink}
                    >
                        <Text style={skipText}>Skip</Text>
                    </Link>

                    <View style={container}>
                        <Swiper
                            loop={false}
                            style={wrapper}
                            showsButtons={false}
                            dotColor='white'
                            activeDotColor='#EF5DA8'
                            activeDotStyle={activeDotStyle}
                            onIndexChanged={(index) => {
                                setCurrentSlideIndex(index);
                            }}
                        >
                            <View style={slide}>
                                <Image style={slideImage} source={images.introScreenImage1} />

                                <Text style={slideText}>
                                    Unlock a new way to travel with loved ones through our Family Ride feature.
                                </Text>
                            </View>
                            <View style={slide}>
                                <Image style={slideImage} source={images.introScreenImage2} />

                                <Text style={slideText}>
                                    Experience the freedom of safe travels.
                                </Text>
                            </View>
                            <View style={slide}>
                                <Image style={slideImage} source={images.introScreenImage3} />

                                <Text style={slideText}>
                                    Discover the joy of shared experiences with our Co-Passenger rides.
                                </Text>
                            </View>
                        </Swiper>
                    </View>

                    <View style={{
                        opacity: currentSlideIndex === 2 ? 1 : 0, width: '90%', marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column', gap: 16
                    }}>
                        <Link href={'/(auth)/signup'}>
                            <TouchableRipple rippleColor={Colors.light.tabIconDefault} style={ctaBtn}>
                                <Text style={ctaText}>Get Started</Text>
                            </TouchableRipple>
                        </Link>

                        <Link style={{ width: '100%', height: '100%' }} href={'/(auth)/signin'}>
                            <TouchableRipple rippleColor={Colors.light.tabIconDefault} style={[ctaBtn, { backgroundColor: MD2Colors.transparent, borderWidth: 1, borderColor: MD2Colors.white }]}>
                                {/* <Link style={{ width: '100%', height: '100%' }} href={'/(auth)/signin'}>
                        </Link> */}
                                <Text style={ctaText}>Sign in</Text>
                            </TouchableRipple>
                        </Link>
                    </View>
                </View>
            </PaddedScreen>
        </SafeScreen>
    )
}