import { Image, View, } from 'react-native'
import { Text } from 'react-native-paper'
import React from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import PaddedScreen from '@/components/shared/paddedScreen'
import { image, wHFull } from '@/utils/imageStyles'
import { bg, flex, flexCol, gap, itemsCenter, justifyBetween, justifyCenter, mt, px, py, relative, rounded, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import { images } from '@/constants/images'
import { c, colorBlack, colorWhite, fs12, fs14, fw500, neurialGrotesk } from '@/utils/fontStyles'
import AccountPageTitle from '@/components/page/accountPageTitle'
import { router } from 'expo-router'
import { tabs } from '@/constants/tabs'
import { TouchableOpacity } from 'react-native-gesture-handler'
import AccountTextField from '@/components/page/accountTextFeild'

export default function profileInfo() {
    return (
        <SafeScreen>
            <View style={[wHFull,]}>
                <PaddedScreen>

                    {/* Page Header */}

                    <View style={[wFull, flex, itemsCenter, justifyBetween, mt(47),]}>
                        <AccountPageTitle
                            title='Profile Information'
                            onPress={() => router.push(`/(tab)/${tabs.account}`)}
                            style={[]}
                        />

                        {/* Edit / Save profile Btn */}

                        {false ?
                            (<TouchableOpacity style={[flex, rounded(100), gap(10), py(13), px(26), itemsCenter, bg('#F9F7F8'), { borderColor: Colors.light.border, borderWidth: 0.7 }]}>
                                <Image source={images.editBtnImage} style={[image.w(18), image.h(18),]} />

                                <Text style={[neurialGrotesk, fs12, fw500, colorBlack]}>Edit</Text>
                            </TouchableOpacity>)
                            :
                            (<TouchableOpacity style={[flex, rounded(100), gap(10), py(13), px(26), itemsCenter, bg(Colors.light.background), { borderColor: Colors.light.border, borderWidth: 0.7 }]}>
                                <Image source={images.whiteBgEditBtnImage} style={[image.w(18), image.h(18),]} />

                                <Text style={[neurialGrotesk, fs12, fw500, colorWhite]}>Save</Text>
                            </TouchableOpacity>)
                        }

                        {/* Edit / Save profile Btn */}

                    </View>

                    {/* Page Header */}

                    {/* User avatar */}

                    <View style={[mt(28), flexCol, gap(16), itemsCenter, wFull]}>
                        <Image source={images.userProfileImage} style={[image.w(100), image.h(100), image.rounded(100)]} />

                        <View style={[flex, itemsCenter, justifyCenter, gap(20)]}>
                            <TouchableOpacity>
                                <Text style={[neurialGrotesk, fw500, fs14, c(Colors.light.background)]}>Upload picture</Text>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Text style={[neurialGrotesk, fw500, fs14, c(Colors.light.error)]}>Generate Avatar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* User avatar */}

                    <View style={[wFull, flexCol, gap(16), mt(60)]}>

                        <AccountTextField
                            input={{
                                fieldKey: 'name',
                                onChangeText: (key, value) => {
                                    console.log({ key, value })
                                },
                                palceHolder: '',
                                value: 'Bolington',
                            }}
                            label={{ text: 'Name' }}
                        />

                        <AccountTextField
                            input={{
                                fieldKey: 'userName',
                                onChangeText: () => { },
                                palceHolder: '',
                                value: 'Bolington',
                            }}
                            label={{ text: 'Username' }}
                        />

                        <AccountTextField
                            input={{
                                fieldKey: 'email',
                                onChangeText: () => { },
                                palceHolder: '',
                                value: 'Bolington@gmail.com',
                                keyboardType: 'email-address'
                            }}
                            label={{ text: 'Email' }}
                        />
                        <AccountTextField
                            input={{
                                fieldKey: 'phoneNo',
                                onChangeText: () => { },
                                palceHolder: '',
                                value: '8789723',
                                keyboardType: 'numeric'
                            }}
                            label={{ text: 'Phone number' }}
                        />
                    </View>

                </PaddedScreen>
            </View>
        </SafeScreen>
    )
}