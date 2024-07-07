import { View, Text } from 'react-native'
import React from 'react'
import { wHFull } from '@/utils/imageStyles'
import { bg } from '@/utils/styles'
import SafeScreen from '@/components/shared/safeScreen'
import PaddedScreen from '@/components/shared/paddedScreen'

export default function deactivateAccount() {
    return (
        <SafeScreen>
            <View style={[bg('red'), { flex: 1 }]}>
                <Text>deactivateAccount</Text>
                <Text>deactivateAccount</Text>
                <Text>deactivateAccount</Text>
                <Text>deactivateAccount</Text>
                <Text>deactivateAccount</Text>
                <Text>deactivateAccount</Text>
            </View>
        </SafeScreen>
    )
}