import React from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { wFull, wHFull } from '@/utils/styles';

const styles = StyleSheet.create({

});

export default function Trip() {
    return (
        <SafeScreen>
            <View style={[wHFull,]}>
                <Text>Trip</Text>
            </View>
        </SafeScreen>
    )
}