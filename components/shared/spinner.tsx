import React from 'react';
import { View, Text, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import { useState } from 'react';
import tw from '@/constants/tw';
import { colors } from '@/constants/Colors';

const Spinner = ({ visible, text }: { visible: boolean, text?: string }) => {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={() => { }}
        >
            <View style={[tw`bg-[#00000005] flex items-center justify-center`, { flex: 1 }]}>
                <View style={[tw`bg-white p-[20px] rounded-[10px] flex items-center justify-center`,]}>
                    <ActivityIndicator size="large" color={colors.grey600} />
                    {/* <Text style={[tw`mt-[10px] text-[16px] text-[#344054]`, { fontFamily: 'mont-regular' }]}>{`${text || 'Loading'}`}</Text> */}
                </View>
            </View>
        </Modal>
    );
};


export default Spinner;