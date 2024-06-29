import React from 'react'
import SafeScreen from '@/components/safeScreen'
import { StyleSheet, View } from 'react-native';
import { wFull, wHFull } from '@/utils/styles';

const styles = StyleSheet.create({

});

export default function Trip() {
    return (
        <SafeScreen>
            <View style={[wHFull, { backgroundColor: 'red' }]}>

            </View>
        </SafeScreen>
    )
}