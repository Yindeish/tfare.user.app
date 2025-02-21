import { View, TouchableOpacity, Image, ViewStyle, TextStyle } from 'react-native'
import React, { useEffect } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import { image, mXAuto, wHFull } from '@/utils/imageStyles'
import PaddedScreen from '@/components/shared/paddedScreen'
import PageTitle from '@/components/shared/pageTitle'
import { Href, router, useGlobalSearchParams } from 'expo-router'
import { bg, flex, flexCol, gap, h, itemsCenter, itemsStart, mr, pt, px, py, rounded, w, wFull } from '@/utils/styles'
import { images } from '@/constants/images'
import { c, colorBlack, fs12, fs14, fs16, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import { tabs } from '@/constants/tabs'
import Colors from '@/constants/Colors'
import { Text } from 'react-native-paper'
import DriverProfileListTile from '@/components/page/driverProfileListTile'
import { FlatList } from 'react-native-gesture-handler'
import FetchService from '@/services/api/fetch.service'
import { useAppSelector } from '@/state/hooks/useReduxToolkit'
import { RootState } from '@/state/store'
import { useSnackbar } from '@/contexts/snackbar.context'
import { IDriver, IUser } from '@/state/types/user'
import { TripStartedSheet } from '@/components/page/tripStartedBottomSheetComponents'
import { useBottomSheet } from '@/contexts/useBottomSheetContext'

export default function
    DriverProfile() {
        const {token} = useAppSelector((state: RootState) => state.user );
        const {Snackbar, snackbarVisible, closeSnackbar, notify} = useSnackbar();
        const {currentRideId} = useGlobalSearchParams();
        const {driverDetails} = useAppSelector((state: RootState) => state.ride);
        const {showBottomSheet} = useBottomSheet()


        const [fetchState, setFetchState] = React.useState<{
            loading: boolean,
            code: number | null,
            msg: string,
            driver: IUser | null
        }>({
            loading: false,
            code: null,
            msg: '',
            driver: driverDetails
        })   
        const {loading, code, msg, driver} = fetchState;

        const vehicle = driver?.driverProfile?.vehicle;

        const getDriverDetails = async () => {
            setFetchState({ ...fetchState, loading: true });
            try {
                await FetchService.getWithBearerToken({
                    url: `/user/rider/me/ride/${currentRideId}/driver-details`,
                    token: token
                }).then(async (res) => {
                    setFetchState({ ...fetchState, loading: false });
                    console.log({res});

                    const data = res?.body? await res.json(): res;
                    const code = data?.code;
                    const msg = data?.message;
                    const driver = data?.driverProfile;

                    if(code && code == 200 && driver){
                        setFetchState({ ...fetchState, code, msg, driver });
                    }else{
                        setFetchState({ ...fetchState, code, msg });
                        notify({msg});
                    }
                })
                .catch((err: any) => {
                    setFetchState({ ...fetchState, loading: false });
                    console.log({err});
                })
                
            } catch (error) {
                console.log(error);
            }
        }

        useEffect(() => {
            !driverDetails && getDriverDetails();
        }, [])

    return (
        <SafeScreen>
            <View style={[wHFull as ViewStyle]}>
                <PaddedScreen>

                    {/* Page Header */}

                    <PageTitle
                        title='Driver Profile'
                        onPress={() => {
                            
                            // router.push(`/(tab)/trip` as Href)
                            showBottomSheet(
                                [500],
                                <TripStartedSheet />
                              );
                              router.setParams({ query: "RideStarted",});
                            router.push(`/(rideScreens)/bookRide` as Href);
                        }}
                        style={[]}
                    >
                        {/* Report Btn */}

                        <TouchableOpacity onPress={() => { }} style={[flex, rounded(100), gap(10), py(13), px(26), itemsCenter, bg('#F9F7F8'), { borderColor: Colors.light.border, borderWidth: 0.7 }]}>
                            <Image source={images.cautionImage} style={[image.w(18), image.h(18),]} />

                            <Text style={[neurialGrotesk, fs12, fw500, colorBlack]}>Report</Text>
                        </TouchableOpacity>


                        {/* Report Btn */}
                    </PageTitle>

                    {/* Page Header */}

                    <View style={[flexCol, gap(32)]}>
                        <View style={[w('auto'), flexCol, gap(32)]}>
                            <Image
                                source={{uri: driver?.picture || driver?.avatar}}
                                style={[image.w(90), image.h(90), image.rounded(90), image.mx('auto')]}
                            />

                            <Text style={[mXAuto as TextStyle, fw700, fs16, colorBlack]}>{driver?.fullName}</Text>

                            <View style={[flex, gap(32), itemsCenter, mXAuto as ViewStyle]}>
                                <View style={[flex, itemsCenter, gap(12)]}>
                                    <Image
                                        source={images.startRatingImage}
                                        style={[image.w(18), image.h(18),]}
                                    />

                                    <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>5.0</Text>
                                </View>

                                <View style={[flex, itemsCenter, gap(12)]}>
                                    <Image
                                        source={images.checkTripImage}
                                        style={[image.w(18), image.h(17),]}
                                    />

                                    <Text style={[fw400, fs14, c(Colors.light.textGrey)]}>ABJ-123-XY</Text>
                                </View>

                            </View>

                            <View style={[flex, itemsCenter, gap(20), mXAuto as ViewStyle]}>
                                <TouchableOpacity onPress={() => { }} style={[flex, rounded(100), gap(10), py(13), px(26), itemsCenter, bg('#F9F7F8'), { borderColor: Colors.light.border, borderWidth: 0.7 }]}>
                                    <Image source={images.chatImage} style={[image.w(18), image.h(18),]} />

                                    <Text style={[neurialGrotesk, fs12, fw500, colorBlack]}>Chat</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { }} style={[flex, rounded(100), gap(10), py(13), px(26), itemsCenter, bg('#F9F7F8'), { borderColor: Colors.light.border, borderWidth: 0.7 }]}>
                                    <Image source={images.phoneImage} style={[image.w(18), image.h(18),]} />

                                    <Text style={[neurialGrotesk, fs12, fw500, colorBlack]}>Call</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[wFull, flexCol, gap(32), pt(32), { borderTopColor: Colors.light.border, borderTopWidth: 0.7 }]}>

                            <DriverProfileListTile text={{ leading: 'Car Model', trailing: vehicle?.vehicleModel as string }} />

                            <DriverProfileListTile text={{ leading: 'Car Package', trailing: 'Standard Ride' }} />

                            <DriverProfileListTile text={{ leading: 'Plate Number', trailing: vehicle?.plateNumber as string }} />

                            <DriverProfileListTile text={{ leading: 'Color', trailing: vehicle?.vehicleColor as string }} />

                            <DriverProfileListTile text={{ leading: 'Phone Number', trailing: String(driver?.phoneNumber) }} />

                            <View style={[wFull, flexCol, itemsStart, gap(20), mr(28)]}>

                                <Text style={[c(Colors.light.textGrey), neurialGrotesk, fs14, fw400]}>Vehicle Images</Text>

                                <FlatList
                                    contentContainerStyle={[h(100)]}
                                    data={[vehicle?.vehicleImages?.frontViewImage, vehicle?.vehicleImages?.sideViewImage, vehicle?.vehicleImages?.backViewImage,vehicle?.vehicleImages?.interiorImage]}
                                    renderItem={({ index, item }) => (
                                        <Image style={[image.w(100), image.h(100)]} source={{uri: item}} />
                                    )}
                                    horizontal
                                    ItemSeparatorComponent={() => (<View style={[w(11)]} />)}
                                />
                            </View>
                        </View>
                    </View>
                </PaddedScreen>

                <Snackbar msg={msg} onDismiss={() => closeSnackbar()} snackbarVisible={snackbarVisible} />
            </View>
        </SafeScreen>
    )
}