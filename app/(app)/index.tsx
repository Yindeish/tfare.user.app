import { Text, View } from 'react-native';

import { useSession } from '../../contexts/userSignedInContext';
import { useSession as useTokenSession } from '@/contexts/userTokenContext';

export default function Index() {
    const { signOut } = useSession();
    const { signOut: signOutToken } = useTokenSession();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text
                onPress={() => {
                    signOut();
                }}>
                Sign Out
            </Text>
            <Text
                onPress={() => {
                    signOutToken();
                }}>
                Sign Out Token
            </Text>
            <Text>Home</Text>
        </View>
    );
}
