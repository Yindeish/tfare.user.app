import { View, Text, Image, TextInput, ViewStyle, TextStyle } from 'react-native'
import React, { useState } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import PaddedScreen from '@/components/shared/paddedScreen'
import { image, wHFull } from '@/utils/imageStyles'
import { bg, flex, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, mt, p, px, py, rounded, wFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import { images } from '@/constants/images'
import { c, colorBlack, colorWhite, fs12, fs14, fs18, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import AccountPageTitle from '@/components/shared/pageTitle'
import { Href, router } from 'expo-router'
import { tabs } from '@/constants/tabs'
import { TouchableOpacity } from 'react-native-gesture-handler'
import EmergencyContactListTile from '@/components/page/emergencyContactsListTile'
import AccountSelectors from '@/state/selectors/account'
import { pages } from '@/constants/pages'
import AddNewContactListTile from '@/components/page/AddNewContactListTile'
import { useAppDispatch } from '@/state/hooks/useReduxToolkit'
import { setEmergencyContactField, setSaveAddressesField } from '@/state/slices/account'
import { IStateInputAddNewContact, IStateInputSaveNewAddress } from '@/state/types/account'
import { number, ObjectSchema, string } from 'yup'
import { useSession } from '@/contexts/userTokenContext'
import { useFormik } from 'formik'
import FetchService from '@/services/api/fetch.service'
import ErrorMsg from '@/components/shared/error_msg'
import { ActivityIndicator } from 'react-native'

export default function SaveNewAddress() {
    const dispatch = useAppDispatch()
    const { } = AccountSelectors();

    const { tokenSession } = useSession()

    const [state, setState] = useState({
        msg: '',
        code: null,
        loading: false
    })
    const { code, msg, loading } = state;

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } = useFormik({
        initialValues: {
            busstopName: '',
            busstopTitle: ''
        },
        validationSchema: new ObjectSchema({
            busstopName: string().required(),
            busstopTitle: string().required()
        }),
        onSubmit: async ({ busstopName, busstopTitle }) => {
            onChange({ key: 'loading', value: true });
            onChange({ key: 'msg', value: '' });

            const returnedData = await FetchService.postWithBearerToken({
                token: tokenSession as string,
                url: '/user/rider/me/busstop/save',
                data: { busstopName, busstopTitle }
            })

            onChange({ key: 'loading', value: false });
            onChange({ key: 'code', value: returnedData?.code });
            onChange({ key: 'msg', value: returnedData.msg });

            if (returnedData?.code == 200 || returnedData?.code == 201) {
                setValues({
                    busstopName: '', busstopTitle: ''
                })
                router.push('/(account)/savedAddresses')
            }
        }
    })

    const onChange = ({ key, value }: { key: 'code' | 'msg' | 'loading', value: string | number | boolean }) => setState((prev) => ({ ...prev, [key]: value }));

    return (
        <SafeScreen>
            <View style={[wHFull as ViewStyle,]}>
                <PaddedScreen>
                    {/* Page Header */}

                    <View style={[wFull, flex, itemsCenter, justifyBetween, mt(47),]}>
                        <AccountPageTitle
                            title='Save New Address'
                            onPress={() => router.push(`/(account)/${pages.savedAddresses}` as Href)}
                            style={[]}
                        />

                    </View>

                    {/* Page Header */}

                    {loading && <ActivityIndicator />}

                    <View style={[wFull, flexCol, gap(40), mt(28)]}>
                        <View style={[wFull, flexCol, gap(16)]}>

                            <View style={[wFull, h(50), rounded(10), py(16), px(24), flex, gap(10), bg('#F9F7F8')]}>

                                <TextInput
                                    onChangeText={handleChange('busstopTitle')}
                                    onBlur={handleBlur('busstopTitle')}
                                    value={values.busstopTitle} placeholder={'Enter Address Name'}

                                    style={[wHFull as TextStyle, { borderWidth: 0 }]}

                                    // others
                                    cursorColor={Colors.light.background}
                                    selectionColor={colors.transparent}
                                    underlineColorAndroid={colors.transparent}
                                    placeholderTextColor={Colors.light.textGrey}
                                />
                            </View>

                            <View style={[wFull, h(52), rounded(10), py(16), px(24), bg('#F9F7F8'), flex, gap(10), itemsCenter, justifyCenter]}>
                                <TouchableOpacity>
                                    <Image style={[image.w(15), image.h(20)]} source={images.locationImage} />
                                </TouchableOpacity>

                                <TextInput
                                    onChangeText={handleChange('busstopName')}
                                    onBlur={handleBlur('busstopName')}
                                    value={values.busstopName}
                                    style={[fs14, fw500, neurialGrotesk, h(20) as TextStyle, { color: Colors.light.textGrey, borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }]}
                                    placeholderTextColor={Colors.light.textGrey}
                                    cursorColor={Colors.light.textGrey}
                                    placeholder="Enter Location"
                                />

                                <TouchableOpacity>
                                    <Image style={[image.w(22), image.h(22)]} source={images.pickUpImage} />
                                </TouchableOpacity>
                            </View>

                        </View>

                        <ErrorMsg msg={msg} code={code} />

                        <TouchableOpacity
                            disabled={loading}
                            onPress={() => handleSubmit()}>
                            <View style={[wFull, h(50), rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.background)]}>
                                <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>Save</Text>

                                <Image style={[image.w(20), image.h(20)]} source={images.proceedCheckImage} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </PaddedScreen>
            </View>
        </SafeScreen>
    )
}

{/* <View style={[wFull, h(50), rounded(10), py(16), px(24), flex, gap(10), bg('#F9F7F8')]}>
    <Image style={[image.w(icon.w as number), image.h(icon.h as number)]} source={icon.src} />}

    <TextInput
        onChangeText={(text) => input.onChangeText(input.fieldKey, text)}

        value={input.value} placeholder={input.palceHolder}

        style={[!icon.present ? wHFull : { flex: 0.8 }, { borderWidth: 0 }]}

        // others
        cursorColor={Colors.light.background}
        selectionColor={colors.transparent}
        keyboardType={'' || input.keyboardType}
        underlineColorAndroid={colors.transparent}
        placeholderTextColor={Colors.light.textGrey}
    />
</View> */}