import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Swiper from 'react-native-swiper'

const { container, page, slide1, slide2, slide3, text, wrapper, activeDotStyle } = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5D5FEF'
    },
    page: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapper: {},
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },
    activeDotStyle: {
        width: 14,
        height: 7,
        borderRadius: 10
    }
});

export default function introScreen() {
    return (
        <View style={container}>
            <Swiper
                style={wrapper}
                showsButtons={false}
                dotColor='white'
                activeDotColor='#EF5DA8'
                activeDotStyle={activeDotStyle}
            >
                <View style={slide1}>
                    <Text style={text}>Hello Swiper</Text>
                </View>
                <View style={slide2}>
                    <Text style={text}>Beautiful</Text>
                </View>
                <View style={slide3}>
                    <Text style={text}>And simple</Text>
                </View>
            </Swiper>
        </View>
    )
}