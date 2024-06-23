import { View, Text, Dimensions, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { Link, router } from 'expo-router'
import { useSession } from '@/contexts/userSignedInContext';
import { useSession as useTokenSession } from '@/contexts/userTokenContext';

export default function signin() {
    const { signIn } = useSession();
    const { signIn: signInwithToken, session, isLoading } = useTokenSession();

    useEffect(() => {
        console.log({ session })
    }, [session])

    const { width, height } = Dimensions.get('window');

    return (
        <View style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <Pressable onPress={signIn}>
                <Text>signin user</Text>
            </Pressable>
            <Link href={'/(app)/'}>Home (user)</Link>
            <Pressable onPress={signInwithToken}>
                <Text>signin with token</Text>
            </Pressable>
            <Link href={'/'}>Index (token)</Link>
        </View>
    )
}