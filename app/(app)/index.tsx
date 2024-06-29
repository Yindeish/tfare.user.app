import { Text, View } from 'react-native';

import { useSession } from '../../contexts/userSignedInContext';
import { useSession as useTokenSession } from '../../contexts/userTokenContext';
import React from 'react';
import SafeScreen from '@/components/safeScreen';
import { flexCol, wHFull } from '@/utils/styles';
import { colors } from '@/constants/Colors';
import UserBlock from '@/components/tab/home/userBlock';
import BannerBlock from '@/components/tab/home/bannerBlock';

export default function Index() {
    const { signOut } = useSession();
    const { signOut: signOutToken } = useTokenSession();
    return (
        <SafeScreen>
            <View style={[wHFull, flexCol, { overflow: 'scroll' }]}>
                <UserBlock />
                <BannerBlock />
            </View>
        </SafeScreen>
    );
}
