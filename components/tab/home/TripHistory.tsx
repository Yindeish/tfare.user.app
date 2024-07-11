import { View, StyleSheet, FlatList, Dimensions, ScrollView } from 'react-native'
import { Text } from 'react-native-paper'
import React from 'react'
import PaddedScreen from '@/components/shared/paddedScreen';
import { fonts } from '@/constants/fonts';
import Colors, { colors } from '@/constants/Colors';
import { flex, flexCol, hFull, itemsStart, justifyBetween, wFull } from '@/utils/styles';
import { colorBlack, colorTextGrey, fs12, fs14, fs16, fw400, fw700, neurialGrotesk } from '@/utils/fontStyles';

const { } = StyleSheet.create({

});

interface IItem {
    name: string,
    startTime: string,
    endTime: string,
    amount: string,
    routeID: string
}

export default function TripHistory() {
    const { height } = Dimensions.get('window');

    const DATA: IItem[] = [
        {
            name: 'Dugbe Bus Stop',
            amount: '0000.00',
            endTime: 'Apr 14, 2024',
            routeID: '1234567ABC',
            startTime: '8:41 AM'
        },
        {
            name: 'Dugbe Bus Stop',
            amount: '0000.00',
            endTime: 'Apr 14, 2024',
            routeID: '1234567DBC',
            startTime: '8:41 AM'
        },
        {
            name: 'Dugbe Bus Stop',
            amount: '0000.00',
            endTime: 'Apr 14, 2024',
            routeID: '1234567CBC',
            startTime: '8:41 AM'
        },
    ];

    return (
        <PaddedScreen styles={{ marginTop: 12, height: 'auto' }}>
            <View style={[flexCol, { gap: 32, }]}>
                <Text style={[colorBlack, neurialGrotesk, fw700, fs16]}>Trip History</Text>

                <View style={[flexCol, { gap: 32, height: DATA.length * 100 }]}>
                    {DATA.map((item, index) => (
                        <View style={[flex, wFull, itemsStart, justifyBetween, { paddingRight: 16, paddingBottom: 16, height: 59, borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]} key={index}>
                            <View style={[flexCol, itemsStart, justifyBetween, hFull]}>
                                <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{item.name}</Text>
                                <Text style={[neurialGrotesk, colorTextGrey, fs12, fw400]}>{`${item.startTime} - ${item.endTime}`}</Text>
                            </View>

                            <View style={[flexCol, itemsStart, justifyBetween, hFull]}>
                                <Text style={[neurialGrotesk, fw400, fs14, { color: '#27AE65' }]}>{`₦${item.amount}`}</Text>
                                <Text style={[neurialGrotesk, colorTextGrey, fw400, fs12]}>{`#${item.routeID}`}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </PaddedScreen>
    )
}