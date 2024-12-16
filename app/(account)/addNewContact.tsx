import { View, Text, Image, ViewStyle } from 'react-native'
import React, { useEffect, useState } from 'react'
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
import { setEmergencyContactField } from '@/state/slices/account'
import { IStateInputAddNewContact } from '@/state/types/account'
import { useSession } from '@/contexts/userTokenContext'
import FetchService from '@/services/api/fetch.service'
import { useFormik } from 'formik'
import { number, ObjectSchema, string } from 'yup'
import { ActivityIndicator } from 'react-native'
import ErrorMsg from '@/components/shared/error_msg'

export default function addNewContact() {
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
            name: '',
            email: '',
            phoneNumber: '',
            whatsAppNumber: ''
        },
        validationSchema: new ObjectSchema({
            name: string().required(),
            email: string().required(),
            phoneNumber: number().required(),
            whatsAppNumber: number().required()
        }),
        onSubmit: async ({ email, name, phoneNumber, whatsAppNumber }) => {
            onChange({ key: 'loading', value: true });
            onChange({ key: 'msg', value: '' });

            const returnedData = await FetchService.postWithBearerToken({
                token: tokenSession as string,
                url: '/user/rider/me/account/emergency-contacts/add',
                data: { email, name, phoneNumber, whatsAppNumber }
            })

            onChange({ key: 'loading', value: false });
            onChange({ key: 'code', value: returnedData.code });
            onChange({ key: 'msg', value: returnedData.msg });

            if (returnedData?.code == 200 || returnedData?.code == 201) {
                setValues({
                    name: '',
                    email: '',
                    phoneNumber: '',
                    whatsAppNumber: ''
                })
                router.push('/(account)/emergencyContacts')
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
                            title='Add New Account'
                            onPress={() => router.push(`/(account)/${pages.emergencyContacts}` as Href)}
                            style={[]}
                        />

                    </View>

                    {/* Page Header */}

                    {loading && <ActivityIndicator />}

                    <View style={[wFull, flexCol, gap(40), mt(28)]}>
                        <View style={[wFull, flexCol, gap(16)]}>

                            <AddNewContactListTile
                                icon={{ present: false, }}
                                input={{
                                    fieldKey: 'contactNameInput',
                                    // onChangeText: (key, value) => {
                                    //     dispatch(setEmergencyContactField({ key: key as unknown as keyof IStateInputAddNewContact, value }))
                                    // },
                                    onChangeText: handleChange('name'),
                                    onBlur: handleBlur('name'),
                                    palceHolder: 'Enter name',
                                    value: values.name,
                                }}
                            />

                            <AddNewContactListTile
                                icon={{ src: images.emailImage, present: true, h: 18, w: 18 }}
                                input={{
                                    fieldKey: 'contactEmailInput',
                                    onChangeText: handleChange('email'),
                                    onBlur: handleBlur('email'),
                                    value: values.email,
                                    palceHolder: 'Enter email',
                                    keyboardType: 'email-address'
                                }}
                            />

                            <AddNewContactListTile
                                icon={{ src: images.phoneImage, present: true, h: 17, w: 17 }}
                                input={{
                                    fieldKey: 'contactPhoneNumberInput',
                                    onChangeText: handleChange('phoneNumber'),
                                    onBlur: handleBlur('phoneNumber'),
                                    value: values.phoneNumber,
                                    palceHolder: 'Enter phone number',
                                    keyboardType: 'numeric'
                                }}
                            />

                            <AddNewContactListTile
                                icon={{ src: images.whatsappImage, present: true, h: 18, w: 18 }}
                                input={{
                                    fieldKey: 'contactWhatsAppInput',
                                    onChangeText: handleChange('whatsAppNumber'),
                                    onBlur: handleBlur('whatsAppNumber'),
                                    value: values.whatsAppNumber,
                                    palceHolder: 'Enter WhatsApp number',
                                    keyboardType: 'numeric'
                                }}
                            />

                        </View>

                        <ErrorMsg msg={msg} code={code} />

                        <TouchableOpacity
                            disabled={loading}
                            onPress={() => handleSubmit()}>
                            <View style={[wFull, h(50), rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.background)]}>
                                <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>Save Contact</Text>

                                <Image style={[image.w(20), image.h(20)]} source={images.proceedCheckImage} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </PaddedScreen>
            </View>
        </SafeScreen>
    )
}