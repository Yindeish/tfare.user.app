import { View, ImageSourcePropType } from 'react-native'
import { Text, } from 'react-native-paper'
import React, { useEffect } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import PaddedScreen from '@/components/shared/paddedScreen'
import { image, wHFull } from '@/utils/imageStyles'
import { bg, flex, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, mt, px, py, relative, rounded, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import { images } from '@/constants/images'
import { c, colorBlack, colorWhite, fs12, fs14, fw500, neurialGrotesk } from '@/utils/fontStyles'
import AccountPageTitle from '@/components/shared/pageTitle'
import { router } from 'expo-router'
import { tabs } from '@/constants/tabs'
import { TouchableOpacity } from 'react-native-gesture-handler'
import AccountTextField from '@/components/page/accountTextFeild'
import AccountSelectors from '@/state/selectors/account'
import { useAppDispatch } from '@/state/hooks/useReduxToolkit'
import { setProfileCta, setUserProfileInfo, setUserProfileInfoFeild } from '@/state/slices/account'
import { IStateInputProfile } from '@/state/types/account'
import { useSession } from '@/contexts/userSignedInContext'
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { UploadApiOptions, upload } from 'cloudinary-react-native'
import CloudinaryServices from '@/cloudinary/cloudinary.services'


export default function profileInfo() {
    const dispatch = useAppDispatch()
    const { profileCta, stateInput, } = AccountSelectors();
    const { user } = useSession()

    const { emailInput, nameInput, phoneNoInput, userNameInput, avatarInput, imageInput } = stateInput.profile;

    const editProfile = () => {
        dispatch(setProfileCta('save'));
    }

    const saveProfile = () => {
        dispatch(setProfileCta('edit'));
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            dispatch(setUserProfileInfoFeild({ key: 'imageInput', value: result.assets[0].uri as string }))
            CloudinaryServices.uploadImage({
                imagePath: imageInput, folderName: 'ridersImages', fnToRn: (value) => {
                    dispatch(setUserProfileInfoFeild({ key: 'imageInput', value }))
                }
            })
        }
    };

    const generateAvatar = () => {
        const AVATAR_API_URL = 'https://api.multiavatar.com'

        const userProfileName = user?.profileName;
        const userAvatar = `${AVATAR_API_URL}/${userProfileName}`;

        dispatch(setUserProfileInfoFeild({ key: 'avatarInput', value: userAvatar }));
        console.log({ avatarInput })
    }


    return (
        <SafeScreen>
            <View style={[wHFull,]}>
                <PaddedScreen>

                    {/* Page Header */}

                    <AccountPageTitle
                        title='Profile Information'
                        onPress={() => router.push(`/(tab)/${tabs.account}`)}
                        style={[]}
                    >
                        {/* Edit / Save profile Btn */}

                        {profileCta === 'edit' ?
                            (<TouchableOpacity onPress={editProfile} style={[flex, rounded(100), gap(10), py(13), px(26), itemsCenter, bg('#F9F7F8'), { borderColor: Colors.light.border, borderWidth: 0.7 }]}>
                                <Image source={images.editBtnImage} style={[image.w(18), image.h(18),]} />

                                <Text style={[neurialGrotesk, fs12, fw500, colorBlack]}>Edit</Text>
                            </TouchableOpacity>)
                            :
                            (<TouchableOpacity onPress={saveProfile} style={[flex, rounded(100), gap(10), py(13), px(26), itemsCenter, bg(Colors.light.background), { borderColor: Colors.light.border, borderWidth: 0.7 }]}>
                                <Image source={images.whiteBgEditBtnImage} style={[image.w(18), image.h(18),]} />

                                <Text style={[neurialGrotesk, fs12, fw500, colorWhite]}>Save</Text>
                            </TouchableOpacity>)
                        }

                        {/* Edit / Save profile Btn */}
                    </AccountPageTitle>

                    {/* Page Header */}

                    {/* User avatar */}

                    <View style={[mt(28), flexCol, gap(16), itemsCenter, wFull, h(134)]}>
                        {(user?.picture || user?.avatar) ?
                            (<Image source={user?.picture || user?.avatar} style={[image.w(100), image.h(100), image.rounded(100)]} />)
                            :
                            (<Image source={imageInput !== '' || avatarInput !== '' ? { uri: imageInput || avatarInput } : images.fallbackAvatar} style={[image.w(100), image.h(100), image.rounded(100)]} />)
                        }

                        {profileCta === 'save' && (!user?.picture || !user?.avatar) && <View style={[flex, itemsCenter, justifyCenter, gap(20)]}>
                            <TouchableOpacity onPress={() => pickImage()}>
                                <Text style={[neurialGrotesk, fw500, fs14, c(Colors.light.background)]}>Upload picture</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => generateAvatar()}>
                                <Text style={[neurialGrotesk, fw500, fs14, c(Colors.light.error)]}>Generate Avatar</Text>
                            </TouchableOpacity>
                        </View>}
                    </View>

                    {/* User avatar */}

                    <View style={[wFull, flexCol, gap(16), mt(60)]}>

                        <AccountTextField
                            input={{
                                fieldKey: 'nameInput',
                                onChangeText: (key, value) => {
                                    dispatch(setUserProfileInfoFeild({ key: key as unknown as keyof IStateInputProfile, value }))
                                },
                                palceHolder: '',
                                value: nameInput,
                                editing: profileCta === 'save'
                            }}
                            label={{ text: 'Name' }}
                        />

                        <AccountTextField
                            input={{
                                fieldKey: 'userNameInput',
                                onChangeText: (key, value) => {
                                    dispatch(setUserProfileInfoFeild({ key: key as unknown as keyof IStateInputProfile, value }))
                                },
                                palceHolder: '',
                                value: userNameInput,
                                editing: profileCta === 'save'
                            }}
                            label={{ text: 'Username' }}
                        />

                        <AccountTextField
                            input={{
                                fieldKey: 'emailInput',
                                onChangeText: (key, value) => {
                                    dispatch(setUserProfileInfoFeild({ key: key as unknown as keyof IStateInputProfile, value }))
                                },
                                palceHolder: '',
                                value: emailInput,
                                editing: profileCta === 'save',
                                keyboardType: 'email-address'
                            }}
                            label={{ text: 'Email' }}
                        />
                        <AccountTextField
                            input={{
                                fieldKey: 'phoneNoInput',
                                onChangeText: (key, value) => {
                                    dispatch(setUserProfileInfoFeild({ key: key as unknown as keyof IStateInputProfile, value }))
                                },
                                palceHolder: '',
                                value: phoneNoInput,
                                editing: profileCta === 'save',
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