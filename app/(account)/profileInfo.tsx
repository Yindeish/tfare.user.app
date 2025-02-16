import { View, ImageSourcePropType, Image, ViewStyle, TextInput, TextStyle, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Text, } from 'react-native-paper'
import React, { useEffect, useState } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import PaddedScreen from '@/components/shared/paddedScreen'
import { image, wHFull } from '@/utils/imageStyles'
import { bg, border, flex, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, mt, px, py, relative, rounded, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import { images } from '@/constants/images'
import { c, colorBlack, colorWhite, fs12, fs14, fw500, neurialGrotesk } from '@/utils/fontStyles'
import AccountPageTitle from '@/components/shared/pageTitle'
import { Href, router } from 'expo-router'
import { tabs } from '@/constants/tabs'
import AccountTextField from '@/components/page/accountTextFeild'
import AccountSelectors from '@/state/selectors/account'
import { useAppDispatch } from '@/state/hooks/useReduxToolkit'
import { setProfileCta, setUserProfileInfo, setUserProfileInfoFeild } from '@/state/slices/account'
import { IStateInputProfile, IUserAccount } from '@/state/types/account'
import { useSession } from '@/contexts/userSignedInContext'
import * as ImagePicker from 'expo-image-picker';
import { useFormik } from 'formik'
import { number, ObjectSchema, string } from 'yup'
// import { UploadApiOptions, upload } from 'cloudinary-react-native'
// import CloudinaryServices from '../../cloudinary/cloudinary.services'
import { useSession as useTokenSession } from '@/contexts/userTokenContext'
import FetchService from '@/services/api/fetch.service'
import ErrorMsg from '@/components/shared/error_msg'
import CloudinaryServices from '@/cloudinary/cloudinary.services'
import { useStorageState } from '@/hooks/useStorageState'


export default function profileInfo() {
    const dispatch = useAppDispatch()
    const { profileCta, stateInput, } = AccountSelectors();
    // const [[_, userSession],] = useSession();
    const [[_, userSession], updateUserSession] = useStorageState('user');
    const user = JSON.parse(userSession as string) as IUserAccount;

    console.log({ user })

    const { tokenSession } = useTokenSession()

    const [state, setState] = useState({
        msg: '',
        code: null,
        loading: false
    })
    const { code, msg, loading } = state;

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } = useFormik({
        initialValues: {
            fullName: user?.fullName || '',
            userName: user?.fullName || '',
            email: user?.email || '',
            phoneNumber: String(user?.phoneNumber)|| '',
        },
        validationSchema: new ObjectSchema({
            fullName: string(),
            userName: string(),
            email: string(),
            phoneNumber: number(),
        }),
        onSubmit: async ({ email, fullName, phoneNumber, userName }) => {

            onChange({ key: 'loading', value: true });
            onChange({ key: 'msg', value: '' });

            const returnedData = await FetchService.patchWithBearerToken({
                token: tokenSession as string,
                url: '/user/account/user/edit',
                data: { email, fullName, phoneNumber, profileName: userName, picture: imgUploadState.img || user?.picture, avatar: imgUploadState.avatar || user?.avatar }
            })

            onChange({ key: 'loading', value: false });
            onChange({ key: 'code', value: returnedData?.code });
            onChange({ key: 'msg', value: returnedData?.msg });

            if (returnedData?.code == 200 || returnedData?.code == 201) {
                updateUserSession(JSON.stringify(returnedData?.userProfileUpdated));
                setValues({
                    fullName: '',
                    userName: '',
                    email: '',
                    phoneNumber: '',
                })
                dispatch(setProfileCta('edit'));
            }
        }
    })

    const [imgUploadState, setImgUploadState] = useState({
        msg: '',
        loading: false,
        img: null,
        avatar: null
        // img: user?.picture,
        // avatar: user?.avatar,
    })

    const onChange = ({ key, value }: { key: 'code' | 'msg' | 'loading', value: string | number | boolean }) => setState((prev) => ({ ...prev, [key]: value }));

    const editProfile = () => {
        dispatch(setProfileCta('save'));
    }

    const uploadImgToCloudinary = async ({ folderName, imagePath }: {
        imagePath: string;
        folderName: string;
    }) => {
        setImgUploadState((prev) => ({ ...prev, loading: true }))

        CloudinaryServices.uploadImage({
            imagePath, folderName, fnToRn: (value) => {

                setImgUploadState((prev) => ({ ...prev, loading: false, img: value as any }))
            }
        })
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri as string;
            uploadImgToCloudinary({ folderName: 'ridersImages', imagePath: uri })

        }
    };

    const generateAvatar = () => {
        const AVATAR_API_URL = 'https://api.multiavatar.com'

        const userProfileName = user?.fullName;
        const userAvatar = `${AVATAR_API_URL}/${userProfileName}`;
        console.log({ userAvatar })

        setImgUploadState((prev) => ({ ...prev, avatar: userAvatar as any }))
    }

    useEffect(() => {
        setValues({
            fullName: user?.fullName as string,
            userName: (user as any)?.profileName || user?.userName as string,
            email: user?.email as string,
            phoneNumber: String(user?.phoneNumber as number),
        })
    }, [])


    return (
        <SafeScreen>
            <View style={[wHFull as ViewStyle,]}>
                <PaddedScreen>

                    {/* Page Header */}

                    <AccountPageTitle
                        title='Profile Information'
                        onPress={() => {
                            dispatch(setProfileCta('edit'));
                            router.push(`/(tab)/${tabs.account}` as Href)
                        }}
                        style={[]}
                    >
                        {/* Edit / Save profile Btn */}

                        {profileCta === 'edit' ?
                            (<TouchableOpacity onPress={editProfile} style={[flex, rounded(100), gap(10), py(13), px(26), itemsCenter, bg('#F9F7F8'), { borderColor: Colors.light.border, borderWidth: 0.7 }]}>
                                <Image source={images.editBtnImage} style={[image.w(18), image.h(18),]} />

                                <Text style={[neurialGrotesk, fs12, fw500, colorBlack]}>Edit</Text>
                            </TouchableOpacity>)
                            :
                            (<TouchableOpacity onPress={() => handleSubmit()} style={[flex, rounded(100), gap(10), py(13), px(26), itemsCenter, bg(Colors.light.background), { borderColor: Colors.light.border, borderWidth: 0.7 }]}>
                                <Image source={images.whiteBgEditBtnImage} style={[image.w(18), image.h(18),]} />

                                <Text style={[neurialGrotesk, fs12, fw500, colorWhite]}>Save</Text>
                            </TouchableOpacity>)
                        }

                        {/* Edit / Save profile Btn */}
                    </AccountPageTitle>

                    {/* Page Header */}

                    {loading && <ActivityIndicator />}

                    {/* User avatar */}

                    <View style={[mt(28), flexCol, gap(16), itemsCenter, wFull, h(134)]}>
                        {/* {(user?.picture || user?.avatar) ? */}
                        {(user?.picture || user?.avatar) ?
                            (<Image source={{ uri: user?.picture as any || user?.avatar }} style={[image.w(100), image.h(100), image.rounded(100)]} />)
                            :
                            (<Image source={(imgUploadState.img || imgUploadState.avatar) ? { uri: imgUploadState.img || imgUploadState.avatar } : images.fallbackAvatar} style={[image.w(100), image.h(100), image.rounded(100)]} />)
                        }

                        {/* {profileCta === 'save' && (!user?.picture || !user?.avatar) && <View style={[flex, itemsCenter, justifyCenter, gap(20)]}> */}
                        {(profileCta === 'save' && (!user?.picture)) && <View style={[flex, itemsCenter, justifyCenter, gap(20)]}>
                            <TouchableOpacity onPress={pickImage} style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                <Text style={[neurialGrotesk, fw500, fs14, c(Colors.light.background)]}>Upload picture</Text>
                                {imgUploadState.loading && <ActivityIndicator size={10} />}
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => generateAvatar()}>
                                <Text style={[neurialGrotesk, fw500, fs14, c(Colors.light.error)]}>Generate Avatar</Text>
                            </TouchableOpacity>
                        </View>}
                    </View>

                    {/* User avatar */}

                    {/* Form */}
                    <View style={[wFull, flexCol, gap(16), mt(60)]}>

                        <TextInput
                            style={[
                                border(0.7, '#D7D7D7') as TextStyle, rounded(10) as TextStyle, wFull as TextStyle, h(50) as TextStyle, px(24) as TextStyle, bg('#F9F7F8') as TextStyle,
                                errors.email && touched.email ? { borderColor: Colors.light.error } : undefined
                            ]}
                            placeholderTextColor={Colors.light.textGrey}
                            placeholder='Full Name'
                            keyboardType='default'
                            value={values.fullName}
                            onChangeText={handleChange('fullName')}
                            onBlur={handleBlur('fullName')}
                        />

                        <TextInput
                            style={[
                                border(0.7, '#D7D7D7') as TextStyle, rounded(10) as TextStyle, wFull as TextStyle, h(50) as TextStyle, px(24) as TextStyle, bg('#F9F7F8') as TextStyle,
                                errors.email && touched.email ? { borderColor: Colors.light.error } : undefined
                            ]}
                            placeholderTextColor={Colors.light.textGrey}
                            placeholder='User Name'
                            keyboardType='default'
                            value={values.userName}
                            onChangeText={handleChange('userName')}
                            onBlur={handleBlur('userName')}
                        />

                        <TextInput
                            style={[
                                border(0.7, '#D7D7D7') as TextStyle, rounded(10) as TextStyle, wFull as TextStyle, h(50) as TextStyle, px(24) as TextStyle, bg('#F9F7F8') as TextStyle,
                                errors.email && touched.email ? { borderColor: Colors.light.error } : undefined
                            ]}
                            placeholderTextColor={Colors.light.textGrey}
                            placeholder='Email Address'
                            keyboardType='email-address'
                            value={values.email}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                        />

                        <TextInput
                            style={[
                                border(0.7, '#D7D7D7') as TextStyle, rounded(10) as TextStyle, wFull as TextStyle, h(50) as TextStyle, px(24) as TextStyle, bg('#F9F7F8') as TextStyle,
                                errors.phoneNumber && touched.phoneNumber ? { borderColor: Colors.light.error } : undefined
                            ]}
                            placeholderTextColor={Colors.light.textGrey}
                            placeholder='Phone Number'
                            keyboardType='numeric'
                            value={values.phoneNumber}
                            onChangeText={handleChange('phoneNumber')}
                            onBlur={handleBlur('phoneNumber')}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <ErrorMsg msg={msg} code={code} />
                    </View>
                    {/* Form */}

                </PaddedScreen>
            </View>
        </SafeScreen>
    )
}