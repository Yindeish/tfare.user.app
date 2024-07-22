import React from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { flexCol, itemsCenter, justifyCenter, wFull, wHFull } from '@/utils/styles';
import { images } from '@/constants/images';
import { image } from '@/utils/imageStyles';

const styles = StyleSheet.create({

});

export default function Trip() {
    return (
        <SafeScreen>
            <View style={[wHFull, flexCol, itemsCenter, justifyCenter]}>
                <Image
                    source={images.comingSoonImage}
                    style={[image.w(276), image.h(369)]}
                />
            </View>
        </SafeScreen>
    )
}