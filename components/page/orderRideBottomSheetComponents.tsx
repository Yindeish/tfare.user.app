import { View, Image, TextInput, TouchableOpacity, ScrollView, FlatList, Pressable, Button, Dimensions, ActivityIndicator } from "react-native";
import PaddedScreen from "../shared/paddedScreen";
import { absolute, bg, flex, flexCenter, flexCol, gap, h, hFull, itemsCenter, itemsEnd, itemsStart, justifyBetween, justifyCenter, justifyStart, left0, mLAuto, mRAuto, mXAuto, ml, mt, p, pLAuto, pXAuto, pb, pl, px, py, relative, right0, rounded, t, top0, w, wFull, wHFull, zIndex } from "@/utils/styles";
import { Text, Portal, Dialog, Paragraph } from "react-native-paper";
import { c, colorBlack, colorBlueBg, colorBorderGrey, colorWhite, fs10, fs12, fs14, fs16, fs18, fw400, fw500, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { images } from "@/constants/images";
import { image } from "@/utils/imageStyles";
import Colors, { colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import LayoutSelectors from "@/state/selectors/layout";
import { useDispatch } from "react-redux";
import { } from "@/state/slices/layout";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import RideSelectors from "@/state/selectors/ride";
import { setState, setStateInputField, } from "@/state/slices/ride";
import { Href, router, useGlobalSearchParams, usePathname } from "expo-router";
import BottomSheet, { BottomSheetFlatList, BottomSheetView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import BottomSheetTitle from "../shared/bottomSheetTitle";
import { useBottomSheet } from "@/contexts/useBottomSheetContext";
import { pages } from "@/constants/pages";
import FetchService from "@/services/api/fetch.service";
import { useSession } from "@/contexts/userTokenContext";
import { useSession as UserSession } from "@/contexts/userSignedInContext";
import { setSavedAddresses } from "@/state/slices/account";
import { IAddress } from "@/state/types/account";
import { RootState } from "@/state/store";
import AccountSelectors from "@/state/selectors/account";
import { useStorageState } from "@/hooks/useStorageState";
import { useLocalSearchParams } from 'expo-router';
import { socket } from "@/socket.io/socket.io.config";
import { IRideAccptedEvent } from "@/socket.io/socket.io.types";

const RecentLocationsSnippet = () => {
    const dispatch = useDispatch();
    const [[isLoading, session], setSession] = useStorageState('token');
    const { savedAddresses } = AccountSelectors()

    const { showBottomSheet } = useBottomSheet();
    const { stateInput: { dropoffBusstopInput, pickupBusstopInput, }, } = RideSelectors();

    const [fetchState, setFetchState] = useState({
        loading: false,
    })
    const { loading } = fetchState;

    const getSavedBusstops = async () => {
        setFetchState({ loading: true });
        const returnedData = await FetchService.getWithBearerToken({ url: '/user/rider/me/busstop/saved-busstops', token: session as string });
        const allBusStops = returnedData?.allBusStops as IAddress[];

        setFetchState({ loading: false });
        if (allBusStops) {
            dispatch(setSavedAddresses(allBusStops));
        }
    }

    const openRecentPickupLocations = () => {
        showBottomSheet([508,], <RecentPickupLocations />)
        router.setParams({ query: 'RecentPickupLocations' });
    }

    const openRecentDropoffLocations = () => {
        showBottomSheet([508,], <RecentDropoffLocations />)
        router.setParams({ query: 'RecentDropoffLocations' });
    }

    useEffect(() => {
        session && getSavedBusstops();
    }, [session])

    return (
        <PaddedScreen>
            <View style={[flexCol, gap(56), mt(20),]}>
                <View style={[flexCol, gap(20),]}>
                    <View style={[wFull, flex, itemsCenter, justifyBetween]}>
                        <Text style={[neurialGrotesk, fw700, fs16, colorBlack]}>Pick up bus stop</Text>
                        <TouchableOpacity onPress={openRecentPickupLocations}>
                            <Text style={[neurialGrotesk, fw400, fs14, colorBlueBg]}>recent locations</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[wFull, h(52), rounded(10), py(16), px(24), bg('#F9F7F8'), flex, gap(10), itemsCenter, justifyCenter]}>
                        <TouchableOpacity>
                            <Image style={[image.w(15), image.h(20)]} source={images.locationImage} />
                        </TouchableOpacity>

                        <TextInput
                            style={[fs14, fw500, neurialGrotesk, h(20), { color: Colors.light.textGrey, borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }]}
                            placeholderTextColor={Colors.light.textGrey}
                            cursorColor={Colors.light.textGrey}
                            placeholder="Enter Location"
                            value={pickupBusstopInput?.name || ''}
                            onChangeText={(text) => {
                                dispatch(setStateInputField({ key: 'pickupBusstopInput', value: text }));
                            }}
                        />

                        <TouchableOpacity>
                            <Image style={[image.w(22), image.h(22)]} source={images.pickUpImage} />
                        </TouchableOpacity>
                    </View>

                    {!loading ? (<FlatList
                        style={[wFull, h(46), flex, gap(16),]}
                        horizontal
                        data={savedAddresses}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => dispatch(setStateInputField({ key: 'pickupBusstopInput', value: item?.busStop }))}>
                                <View style={[w('auto'), hFull, rounded(100), px(32), gap(10), flex, itemsCenter, justifyCenter, { borderWidth: 1, borderColor: Colors.light.border }]}>
                                    <Text style={[neurialGrotesk, fw500, fs12, colorBlack]}>{item?.busstopTitle}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => (
                            <View style={[w(16), hFull, bg(colors.transparent)]} />
                        )}
                        keyExtractor={(({ }) => Math.random().toString())}
                    />) : (<View style={[wFull, h(50), flexCenter]}><ActivityIndicator style={[w(50), h(50)]} /></View>)}
                </View>

                <View style={[flexCol, gap(20),]}>
                    <View style={[wFull, flex, itemsCenter, justifyBetween]}>
                        <Text style={[neurialGrotesk, fw700, fs16, colorBlack]}>Drop off bus stop</Text>
                        <TouchableOpacity onPress={openRecentDropoffLocations}>
                            <Text style={[neurialGrotesk, fw400, fs14, colorBlueBg]}>recent locations</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[wFull, h(52), rounded(10), py(16), px(24), bg('#F9F7F8'), flex, gap(10), itemsCenter, justifyCenter]}>
                        <Image style={[image.w(15), image.h(20)]} source={images.locationImage} />

                        <BottomSheetTextInput
                            style={[fs14, fw500, neurialGrotesk, h(20), { color: Colors.light.textGrey, borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }]}
                            placeholderTextColor={Colors.light.textGrey}
                            cursorColor={Colors.light.textGrey}
                            placeholder="Enter Destination"
                            value={dropoffBusstopInput?.name || ''}
                            onChangeText={(text) => {
                                dispatch(setStateInputField({ key: 'dropoffBusstopInput', value: text }));
                            }}
                        />

                        <Image style={[image.w(22), image.h(24)]} source={images.dropOffImage} />
                    </View>

                    {!loading ? (<FlatList
                        style={[wFull, h(46), flex, gap(16),]}
                        horizontal
                        data={savedAddresses}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => dispatch(setStateInputField({ key: 'dropoffBusstopInput', value: item?.busStop }))}>
                                <View style={[w('auto'), hFull, rounded(100), px(32), gap(10), flex, itemsCenter, justifyCenter, { borderWidth: 1, borderColor: Colors.light.border }]}>
                                    <Text style={[neurialGrotesk, fw500, fs12, colorBlack]}>{item.busstopTitle}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => (
                            <View style={[w(16), hFull, bg(colors.transparent)]} />
                        )}
                        keyExtractor={(({ }) => Math.random().toString())}
                    />) : (<View style={[wFull, h(50), flexCenter]}><ActivityIndicator style={[w(50), h(50)]} /></View>)}
                </View>

                <TouchableOpacity onPress={() => {
                    showBottomSheet([436, 601], <FilledForm />)
                    router.setParams({ query: 'FilledForm' });
                }}>
                    <View style={[wFull, h(50), rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.background)]}>
                        <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>Proceed</Text>

                        <Image style={[image.w(20), image.h(20)]} source={images.proceedCheckImage} />
                    </View>
                </TouchableOpacity>
            </View>
        </PaddedScreen>
    )
};

const RecentPickupLocations = () => {
    const dispatch = useAppDispatch();
    const { bottomSheet } = LayoutSelectors();
    const { showBottomSheet } = useBottomSheet();
    const { stateInput: { pickupBusstopInput } } = RideSelectors()

    let [inputtingPickupBusstop, setInputtingPickupBusstop] = useState(false);
    const DATA = [
        {
            id: 0,
            name: 'Home',
        },
        {
            id: 1,
            name: 'Apartment',
        },
        {
            id: 2,
            name: 'Workplace',
        },
        {
            id: 3,
            name: 'Workplace',
        },
        {
            id: 4,
            name: 'Workplace',
        },
        {
            id: 5,
            name: 'Workplace',
        },
        {
            id: 6,
            name: 'Workplace',
        },
    ]

    const [visible, setVisible] = useState(false);

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);

    return (
        <PaddedScreen>
            <View style={[flexCol, gap(56), mt(20),]}>
                <View style={[flexCol, gap(20), relative]}>
                    <BottomSheetTitle title="Pick up bus stop" onPressFn={() => {
                        showBottomSheet([601, 800], <RecentLocationsSnippet />);
                        router.setParams({ query: 'RecentLocationsSnippet' });
                    }} />

                    <View style={[wFull, h(52), rounded(10), py(16), px(24), bg('#F9F7F8'), flex, gap(10), itemsCenter, justifyCenter]}>
                        <TouchableOpacity>
                            <Image style={[image.w(15), image.h(20)]} source={images.locationImage} />
                        </TouchableOpacity>

                        <BottomSheetTextInput
                            onFocus={() => setInputtingPickupBusstop(true)}
                            onBlur={() => setInputtingPickupBusstop(false)}
                            style={[fs14, fw500, neurialGrotesk, h(20), { color: Colors.light.textGrey, borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }]}
                            placeholderTextColor={Colors.light.textGrey}
                            cursorColor={Colors.light.textGrey}
                            placeholder="Enter Location"
                            value={pickupBusstopInput?.name || ''}
                            onChangeText={(text) => dispatch(setStateInputField({ key: 'pickupBusstopInput', value: text }))}
                        />

                        <Image style={[image.w(22), image.h(22)]} source={images.pickUpImage} />
                    </View>

                    {inputtingPickupBusstop && <View style={[relative, wFull, h(10), mt(-32)]}>
                        <ScrollView style={[absolute, top0, left0, zIndex(20), wFull, bg(colors.white), h(176), flexCol, gap(30), py(16), px(24), bg('#F9F7F8'), { borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }]}>
                            {['', '', '', '', '', '', '', ''].map((_, index) => (
                                <Text style={[h(30)]} key={index}>meeee</Text>
                            ))}
                        </ScrollView>
                    </View>}

                    <View style={[wFull, h(bottomSheet.snapPoint === 5 ? '100%' : 350), flexCol, gap(32)]}>
                        <View style={[wFull, flex, itemsCenter, gap(15)]}>
                            <Image style={[image.w(21.77), image.h(20)]} source={images.recentImage} />

                            <Text style={[colorBlack, neurialGrotesk, fw400, fs14,]}>Recent locations</Text>
                        </View>

                        <BottomSheetFlatList
                            style={[wFull, h(75 * DATA.length), flexCol, gap(16),]}
                            horizontal={false}
                            data={DATA}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={[wFull]}>
                                    <View style={[wFull, h(59), flex, itemsCenter, justifyBetween]}>
                                        <View style={[flexCol, itemsStart, gap(12)]}>
                                            <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{item.name}</Text>

                                            <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey)]}>{`${item.name} ${item.name} ${item.name} ${item.name}`}</Text>
                                        </View>

                                        <View style={[w('auto'), h(18.06), gap(32), flex, itemsCenter,]}>
                                            <Text style={[neurialGrotesk, fw400, fs14, colorBlack]}>0.8km</Text>

                                            <Pressable onPress={() => {
                                                showDialog();
                                            }}>
                                                <Image style={[image.w(14), image.h(18.06),]} source={images.saveLocationImage} />
                                            </Pressable>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => (
                                <View style={[wFull, h(16), bg(colors.transparent), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]} />
                            )}
                            keyExtractor={(({ id }) => id.toString())}
                        />
                    </View>

                    <Dialog
                        style={[bg(colors.white), rounded(10), t(-300)]}
                        visible={visible} onDismiss={hideDialog}>

                        <Dialog.Title style={[pXAuto,]}>

                            <View style={[wFull, flex, itemsCenter, justifyCenter, gap(16), pb(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>
                                <Image style={[image.w(14), image.h(18.06)]} source={images.saveLocationImage} />

                                <Text style={[neurialGrotesk, fw700, fs16, colorBlack]}>Save Bus Stop</Text>
                            </View>

                        </Dialog.Title>

                        <Dialog.Content>
                            <View style={[wFull, flexCol, gap(10)]}>
                                <View style={[wFull, flex, gap(10), py(16), px(24)]}>
                                    <TextInput
                                        style={[fs14, fw500, neurialGrotesk, h(20), { color: Colors.light.textGrey, borderColor: colors.transparent, borderWidth: 0, flex: 1 }]}
                                        placeholderTextColor={Colors.light.textGrey}
                                        cursorColor={Colors.light.textGrey}
                                        placeholder="Enter Location"
                                        value=""
                                    />
                                </View>

                                <View style={[wFull, flex, itemsCenter, h(52), gap(10), px(24)]}>

                                    <TouchableOpacity style={[]} >
                                        <Image style={[image.w(15), image.h(20)]} source={images.locationImage} />
                                    </TouchableOpacity>

                                    <Text style={[fs14, fw500, neurialGrotesk, c(Colors.light.textGrey), { borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }]}>Obafemi Awolowo Uni..</Text>
                                </View>
                            </View>
                        </Dialog.Content >

                        <Dialog.Actions style={[]}>
                            <TouchableOpacity style={[wFull, h(50), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.background), rounded(10)]}>
                                <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>Save</Text>
                                <Image style={[image.w(20), image.h(20)]} source={images.proceedCheckImage} />
                            </TouchableOpacity>
                        </Dialog.Actions>
                    </Dialog >
                </View >
            </View>
        </PaddedScreen>
    )
}

const RecentDropoffLocations = () => {
    const dispatch = useAppDispatch();
    const { bottomSheet } = LayoutSelectors();
    const { showBottomSheet } = useBottomSheet();
    const { stateInput: { dropoffBusstopInput } } = RideSelectors()

    let [inputtingDropoffBuststop, setInputtingDropoffBuststop] = useState(false);
    const DATA = [
        {
            id: 0,
            name: 'Home',
        },
        {
            id: 1,
            name: 'Apartment',
        },
        {
            id: 2,
            name: 'Workplace',
        },
        {
            id: 3,
            name: 'Workplace',
        },
        {
            id: 4,
            name: 'Workplace',
        },
        {
            id: 5,
            name: 'Workplace',
        },
        {
            id: 6,
            name: 'Workplace',
        },
    ]

    const [visible, setVisible] = useState(false);

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);

    return (
        <PaddedScreen>
            <View style={[flexCol, gap(56), mt(20),]}>
                <View style={[flexCol, gap(20), relative]}>
                    <BottomSheetTitle title="Drop off bus stop" onPressFn={() => {
                        showBottomSheet([601], <RecentLocationsSnippet />);
                        router.setParams({ query: 'RecentLocationsSnippet' });
                    }} />

                    <View style={[wFull, h(52), rounded(10), py(16), px(24), bg('#F9F7F8'), flex, gap(10), itemsCenter, justifyCenter]}>
                        <TouchableOpacity>
                            <Image style={[image.w(15), image.h(20)]} source={images.locationImage} />
                        </TouchableOpacity>

                        <BottomSheetTextInput
                            onFocus={() => setInputtingDropoffBuststop(true)}
                            onBlur={() => setInputtingDropoffBuststop(false)}
                            style={[fs14, fw500, neurialGrotesk, h(20), { color: Colors.light.textGrey, borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }]}
                            placeholderTextColor={Colors.light.textGrey}
                            cursorColor={Colors.light.textGrey}
                            placeholder="Enter Location"
                            value={dropoffBusstopInput?.name || ''}
                            onChangeText={(text) => dispatch(setStateInputField({ key: 'dropoffBusstopInput', value: text }))}
                        />

                        <Image style={[image.w(22), image.h(22)]} source={images.dropOffImage} />
                    </View>

                    {inputtingDropoffBuststop && <View style={[relative, wFull, h(10), mt(-32)]}>
                        <ScrollView style={[absolute, top0, left0, zIndex(20), wFull, bg(colors.white), h(176), flexCol, gap(30), py(16), px(24), bg('#F9F7F8'), { borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }]}>
                            {['', '', '', '', '', '', '', ''].map((_, index) => (
                                <Text style={[h(30)]} key={index}>meeee</Text>
                            ))}
                        </ScrollView>
                    </View>}

                    <View style={[wFull, h(350), flexCol, gap(32)]}>
                        <View style={[wFull, flex, itemsCenter, gap(15)]}>
                            <Image style={[image.w(21.77), image.h(20)]} source={images.recentImage} />

                            <Text style={[colorBlack, neurialGrotesk, fw400, fs14,]}>Recent locations</Text>
                        </View>

                        <BottomSheetFlatList
                            style={[wFull, h(75 * DATA.length), flexCol, gap(16),]}
                            horizontal={false}
                            data={DATA}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={[wFull]}>
                                    <View style={[wFull, h(59), flex, itemsCenter, justifyBetween]}>
                                        <View style={[flexCol, itemsStart, gap(12)]}>
                                            <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{item.name}</Text>

                                            <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey)]}>{`${item.name} ${item.name} ${item.name} ${item.name}`}</Text>
                                        </View>

                                        <View style={[w('auto'), h(18.06), gap(32), flex, itemsCenter,]}>
                                            <Text style={[neurialGrotesk, fw400, fs14, colorBlack]}>0.8km</Text>

                                            <Pressable onPress={() => {
                                                showDialog();
                                            }}>
                                                <Image style={[image.w(14), image.h(18.06),]} source={images.saveLocationImage} />
                                            </Pressable>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => (
                                <View style={[wFull, h(16), bg(colors.transparent), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]} />
                            )}
                            keyExtractor={(({ id }) => id.toString())}
                        />
                    </View>

                    <Dialog
                        style={[bg(colors.white), rounded(10),]}
                        visible={visible} onDismiss={hideDialog}>

                        <Dialog.Title style={[pXAuto,]}>

                            <View style={[wFull, flex, itemsCenter, justifyCenter, gap(16), pb(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>
                                <Image style={[image.w(14), image.h(18.06)]} source={images.saveLocationImage} />

                                <Text style={[neurialGrotesk, fw700, fs16, colorBlack]}>Save Bus Stop</Text>
                            </View>

                        </Dialog.Title>

                        <Dialog.Content>
                            <View style={[wFull, flexCol, gap(10)]}>
                                <View style={[wFull, flex, gap(10), py(16), px(24)]}>
                                    <TextInput
                                        style={[fs14, fw500, neurialGrotesk, h(20), { color: Colors.light.textGrey, borderColor: colors.transparent, borderWidth: 0, flex: 1 }]}
                                        placeholderTextColor={Colors.light.textGrey}
                                        cursorColor={Colors.light.textGrey}
                                        placeholder="Enter Location"
                                        value=""
                                    />
                                </View>

                                <View style={[wFull, flex, itemsCenter, h(52), gap(10), px(24)]}>

                                    <TouchableOpacity style={[]} >
                                        <Image style={[image.w(15), image.h(20)]} source={images.locationImage} />
                                    </TouchableOpacity>

                                    <Text style={[fs14, fw500, neurialGrotesk, c(Colors.light.textGrey), { borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }]}>Obafemi Awolowo Uni..</Text>
                                </View>
                            </View>
                        </Dialog.Content >

                        <Dialog.Actions style={[]}>
                            <TouchableOpacity style={[wFull, h(50), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.background), rounded(10)]}>
                                <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>Save</Text>
                                <Image style={[image.w(20), image.h(20)]} source={images.proceedCheckImage} />
                            </TouchableOpacity>
                        </Dialog.Actions>
                    </Dialog >
                </View >
            </View>
        </PaddedScreen>
    )
}

const FilledForm = () => {
    const dispatch = useAppDispatch();
    const [[isLoading, session], setSession] = useStorageState('token');
    const { } = AccountSelectors()
    const { showBottomSheet } = useBottomSheet();
    const { stateInput: { pickupBusstopInput, dropoffBusstopInput } } = RideSelectors();

    let [inputting, setInputting] = useState({
        pickupBusstop: false,
        dropoffpickupBusstop: false,
    })
    const [fetchState, setFetchState] = useState({
        loading: false,
        msg: '',
        code: null
    })
    const { loading, code, msg } = fetchState;

    const onChange = (key: string, val: boolean) => setInputting((prev) => ({ ...prev, [key]: val }));

    const findRidePlans = async () => {
        setFetchState((prev) => ({ ...prev, loading: true }));
        const returnedData = await FetchService.postWithBearerToken({
            url: '/user/rider/me/ride-plans', data: {
                pickupBusstopId: pickupBusstopInput?._id,
                dropoffBusstopId: dropoffBusstopInput?._id
            }, token: session as string
        });
        const code = returnedData?.code;
        const msg = returnedData?.msg;
        const duration = returnedData?.duration;
        const price = returnedData?.price;
        const seats = returnedData?.vehicles;
        setFetchState((prev) => ({ ...prev, loading: false, msg, code }));

        dispatch(setState({ key: 'duration', value: duration }));
        dispatch(setState({ key: 'price', value: price }));
        dispatch(setState({ key: 'seats', value: seats }));

        if (code == 200) {
            showBottomSheet([477, 601], <RideRouteDetails />);
            router.setParams({ query: 'RideRouteDetails' });
        }
    }

    return (
        <PaddedScreen>
            <View style={[flexCol, gap(56), mt(20),]}>
                <View style={[flexCol, gap(20),]}>
                    <BottomSheetTitle title="Pick up bus stop" onPressFn={() => {
                        showBottomSheet([601], <RecentLocationsSnippet />)
                    }} />

                    <View style={[wFull, h(52), rounded(10), py(16), px(24), bg('#F9F7F8'), flex, gap(10), itemsCenter, justifyCenter]}>
                        <TouchableOpacity>
                            <Image style={[image.w(15), image.h(20)]} source={images.locationImage} />
                        </TouchableOpacity>

                        <TextInput
                            style={[fs14, fw500, neurialGrotesk, h(20), { color: Colors.light.textGrey, borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }]}
                            placeholderTextColor={Colors.light.textGrey}
                            cursorColor={Colors.light.textGrey}
                            placeholder="Enter Location"
                            onFocus={() => onChange('pickupBusstop', true)}
                            onBlur={() => onChange('pickupBusstop', false)}
                            value={pickupBusstopInput?.name || ''}
                        // onChangeText={(text) => dispatch(setStateInputField({ key: 'pickupBusstopInput', value: text }))}
                        />
                    </View>

                    {inputting.pickupBusstop && <View style={[relative, wFull, h(10), mt(-32)]}>
                        <ScrollView style={[absolute, top0, left0, zIndex(20), wFull, bg(colors.white), h(176), flexCol, gap(30), py(16), px(24), bg('#F9F7F8'), { borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }]}>
                            {['', '', '', '', '', '', '', ''].map((_, index) => (
                                <Text style={[h(30)]} key={index}>meeee</Text>
                            ))}
                        </ScrollView>
                    </View>}

                </View>

                <View style={[flexCol, gap(20),]}>
                    <View style={[wFull, flex, itemsCenter, justifyBetween]}>
                        <Text style={[neurialGrotesk, fw700, fs16, colorBlack]}>Drop off bus stop</Text>
                    </View>

                    <View style={[wFull, h(52), rounded(10), py(16), px(24), bg('#F9F7F8'), flex, gap(10), itemsCenter, justifyCenter]}>
                        <TouchableOpacity>
                            <Image style={[image.w(15), image.h(20)]} source={images.locationImage} />
                        </TouchableOpacity>

                        <BottomSheetTextInput
                            style={[fs14, fw500, neurialGrotesk, h(20), { color: Colors.light.textGrey, borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }]}
                            placeholderTextColor={Colors.light.textGrey}
                            cursorColor={Colors.light.textGrey}
                            placeholder="Enter Destination"
                            onFocus={() => onChange('pickupBusstop', true)}
                            onBlur={() => onChange('pickupBusstop', false)}
                            value={dropoffBusstopInput?.name || ''}
                        // onChangeText={(text) => dispatch(setStateInputField({ key: 'dropoffBusstopInput', value: text }))}
                        />
                    </View>

                    {inputting.dropoffpickupBusstop && <View style={[relative, wFull, h(10), mt(-32)]}>
                        <ScrollView style={[absolute, top0, left0, zIndex(20), wFull, bg(colors.white), h(176), flexCol, gap(30), py(16), px(24), bg('#F9F7F8'), { borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }]}>
                            {['', '', '', '', '', '', '', ''].map((_, index) => (
                                <Text style={[h(30)]} key={index}>meeee</Text>
                            ))}
                        </ScrollView>
                    </View>}
                </View>

                {(msg.length > 0 && (code !== 200 || code != 201)) && <Text style={[fs10, c(colors.red500)]}>{msg}</Text>}

                <TouchableOpacity onPress={() => {
                    findRidePlans();
                }} style={[flexCenter]}>
                    {!loading ? (<View style={[wFull, h(50), rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.background)]}>
                        <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>Proceed</Text>

                        <Image style={[image.w(20), image.h(20)]} source={images.proceedCheckImage} />
                    </View>) : (<ActivityIndicator style={[h(50), w(50)]} />)}
                </TouchableOpacity>
            </View>
        </PaddedScreen>
    )
}

const RideRouteDetails = ({ code, msg }: { code?: number | null, msg?: string }) => {
    const { showBottomSheet, } = useBottomSheet();
    const { stateInput: { pickupBusstopInput, dropoffBusstopInput, userCounterFareInput } } = RideSelectors()
    const [[isLoading, session], setSession] = useStorageState('token');
    const [formData, setFormData] = useState({
        riderCounterOffer: ''
    })
    const { riderCounterOffer } = formData;
    const { price, duration, seats } = useAppSelector((state: RootState) => state.ride)

    return (
        <PaddedScreen>
            <View style={[flexCol, gap(56), mt(20),]}>
                <View style={[wFull, flexCol, gap(20)]}>
                    <BottomSheetTitle title="" onPressFn={() => {
                        showBottomSheet([436, 601], <FilledForm />)
                    }} />

                    <View style={[wFull, flex, itemsCenter, justifyBetween, py(17), px(9), bg('#F9F7F8')]}>
                        <Image style={[image.w(50), image.h(18)]} source={images.carImage} />

                        <View style={[flexCol, gap(12), { flex: 0.8 }]}>
                            <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>Standard Ride</Text>

                            <View style={[flex, h(14.73), gap(4), itemsCenter]}>
                                <Image style={[image.w(18), image.h(14.73)]} source={images.passengersImage} />

                                <Text style={[fw400, fs12, c(Colors.light.border)]}>{seats[0]} seats</Text>
                            </View>
                        </View>

                        <Text style={[fw400, fs14, colorBlack]}>₦{price}</Text>
                    </View>

                    <View style={[wFull, py(20), flexCol, gap(16), { borderTopWidth: 0.7, borderTopColor: Colors.light.border, borderBottomWidth: 0.7, borderBottomColor: Colors.light.border, }]}>
                        <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.border)]}>Want to send a counter offer?</Text>

                        <View style={[wFull, h(50), rounded(10), p(16), flex, justifyStart, itemsCenter, gap(10), bg(colors.white), { borderWidth: 0.7, borderColor: code == 400 ? Colors.light.error : Colors.light.border, }]}>
                            <Image style={[image.w(14), image.h(10)]} source={images.rideOfferImage} />

                            <BottomSheetTextInput
                                style={[fs14, fw500, neurialGrotesk, h(20), { color: code == 400 ? Colors.light.error : Colors.light.textGrey, borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }]}
                                keyboardType="number-pad"
                                placeholderTextColor={Colors.light.textGrey}
                                cursorColor={Colors.light.textGrey}
                                placeholder="Input your offer"
                                value={riderCounterOffer}
                                onChangeText={(text) => {
                                    setFormData(prev => ({ ...prev, riderCounterOffer: text }));
                                    router.setParams({ riderCounterOffer: text })
                                }}
                            />
                        </View>

                        {code == 400 && (<View style={[wFull, flex, itemsCenter, justifyStart, gap(12)]}>
                            <Image style={[image.w(20), image.h(21), { objectFit: 'contain' }]} source={images.cautionImage} />

                            {code == 400 && <Text style={[fw400, fs12, c(Colors.light.error)]}>
                                {/* Offer too low to work with */}
                                {msg}
                            </Text>}
                        </View>)}
                    </View>
                </View>

                <TouchableOpacity onPress={() => {
                    showBottomSheet([400], <SearchingRide riderCounterOffer={riderCounterOffer} />);
                    router.setParams({ query: 'SearchingRide' });
                }}>
                    <View style={[wFull, h(50), rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.background)]}>
                        <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>Find Available Rides</Text>

                        <Image style={[image.w(20), image.h(20)]} source={images.proceedCheckImage} />
                    </View>
                </TouchableOpacity>
            </View>
        </PaddedScreen>
    )
}

const SearchingRide = ({ riderCounterOffer }: { riderCounterOffer: string }) => {
    const dispatch = useAppDispatch();
    const { showBottomSheet, hideBottomSheet, } = useBottomSheet();
    const { price, duration, seats } = useAppSelector((state: RootState) => state.ride)

    const { stateInput: { pickupBusstopInput, dropoffBusstopInput, userCounterFareInput } } = RideSelectors()
    const [[isLoading, session], setSession] = useStorageState('token');

    socket.on("rideAccepted", (data: IRideAccptedEvent) => {
        console.log("Ride accepted:", data);
    });

    const [fetchState, setFetchState] = useState({
        loading: false,
        msg: '',
        code: null
    })
    const { code, msg, loading } = fetchState;

    useEffect(() => {
        router.setParams({ query: 'SearchingRide', riderCounterOffer });
    })

    const findAvailableRides = async () => {
        setFetchState((prev) => ({ ...prev, loading: true }));
        const returnedData = await FetchService.postWithBearerToken({
            url: '/user/rider/me/available-rides/find', data: {
                pickupBusstopId: pickupBusstopInput?._id,
                dropoffBusstopId: dropoffBusstopInput?._id,
                ridePlanSeats: seats[0],
                ridePlanName: 'standard',
                userCounterOffer: riderCounterOffer
            }, token: session as string
        });

        const code = returnedData?.code;
        const msg = returnedData?.msg;

        setFetchState((prev) => ({ ...prev, loading: false, msg, code }));

        // if (code && code == 201) {
        //     hideBottomSheet();
        //     router.push(`/${pages.availableRides}` as Href)
        //     setFetchState((prev) => ({ ...prev, loading: false, msg: '', code: null }));
        // }
        // else if (code && code == 400) {
        //     showBottomSheet([477, 601], <RideRouteDetails code={code} msg={msg} />)
        //     setFetchState((prev) => ({ ...prev, loading: false, msg: '', code: null }));
        // }
    }

    const getAvailableRides = async () => {
        setFetchState((prev) => ({ ...prev, loading: true }));
        const returnedData = await FetchService.getWithBearerToken({
            url: '/user/rider/me/available-rides', token: session as string
        });

        const code = returnedData?.code;
        const msg = returnedData?.msg;
        const availableRides = returnedData?.availableRides;

        setFetchState((prev) => ({ ...prev, loading: false, msg, code }));

        if (code && code == 200 && availableRides) {
            console.log({ '__code && code == 200__': code && code == 200, availableRides })
            // hideBottomSheet();
            // router.push(`/${pages.availableRides}` as Href)
            // setFetchState((prev) => ({ ...prev, loading: false, msg: '', code: null }));
        }
        else if (code && code == 400) {
            console.log({ '__code && code == 400__': code && code == 400 })
            // showBottomSheet([477, 601], <RideRouteDetails code={code} msg={msg} />)
            // setFetchState((prev) => ({ ...prev, loading: false, msg: '', code: null }));
        }
    }

    const cancelRide = async () => {
        // run some async db stuffs
        hideBottomSheet();
        router.push(`/(tab)/`);
    }

    useEffect(() => {
        session && findAvailableRides().then(() => {
            getAvailableRides();
        })
    }, [session])

    return (
        <PaddedScreen>
            <View style={[wHFull, flexCol, itemsCenter, gap(44)]}>
                <View style={[flexCol, itemsCenter, gap(16)]}>
                    <View style={[flex, gap(16)]}>
                        <Image style={[image.w(30), image.h(25.91)]} source={images.yellowTripImage} />

                        <Text style={[neurialGrotesk, fw700, colorBlack, { fontSize: 22 }]}>Searching for Rides</Text>
                    </View>

                    <Text style={[c(Colors.light.textGrey), neurialGrotesk, fw400, fs12]}>Searching for nearby available rides</Text>

                    {code == 201 && <Text style={[c(colors.green500), fs10]}>{msg}</Text>}
                </View>

                <Image style={[image.w(120), image.h(120)]} source={images.searchingRideImage} />

                <TouchableOpacity
                    onPress={cancelRide} style={[bg('#F9F7F8'), wFull, h(50), rounded(10), flex, itemsCenter, justifyCenter, gap(10), { borderWidth: 0.7, borderColor: Colors.light.border }]}>
                    <Text style={[c(Colors.light.textGrey), neurialGrotesk, fw700, fs16]}>Cancel</Text>

                    <Image style={[image.w(20), image.h(20),]} source={images.cancelImage} />
                </TouchableOpacity>
            </View>
        </PaddedScreen>
    )
}

export { RecentLocationsSnippet, RecentPickupLocations, RecentDropoffLocations, FilledForm, RideRouteDetails, SearchingRide }
