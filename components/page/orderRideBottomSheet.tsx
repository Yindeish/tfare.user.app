import { View, Image, TextInput, TouchableOpacity, ScrollView, FlatList, Pressable, Button, Dimensions } from "react-native";
import PaddedScreen from "../paddedScreen";
import { absolute, bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsEnd, itemsStart, justifyBetween, justifyCenter, left0, mLAuto, mRAuto, mXAuto, ml, mt, pLAuto, pXAuto, pb, pl, px, py, relative, right0, rounded, top0, w, wFull, zIndex } from "@/utils/styles";
import { Text, Portal, Dialog, Paragraph } from "react-native-paper";
import { c, colorBlack, colorBlueBg, colorBorderGrey, colorWhite, fs12, fs14, fs16, fs18, fw400, fw500, fw700, neurialGrotesk } from "@/utils/fontStyles";
import { images } from "@/constants/images";
import { image } from "@/utils/imageStyles";
import Colors, { colors } from "@/constants/Colors";
import { useState } from "react";

enum EViewStatus {
    recentLocationsSnippet = 'recentLocationsSnippet',
    recentLocations = 'recentLocations',
    routeRideDetails = 'routeRideDetails',
    filledForm = 'filledForm',
    searchingRide = 'searchingRide',
}

const RecentLocationsSnippet = () => {

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
    ]

    return (
        <>
            <View style={[flexCol, gap(20),]}>
                <View style={[wFull, flex, itemsCenter, justifyBetween]}>
                    <Text style={[neurialGrotesk, fw700, fs16, colorBlack]}>Pick up bus stop</Text>
                    <Text style={[neurialGrotesk, fw400, fs14, colorBlueBg]}>recent locations</Text>
                </View>

                <View style={[wFull, h(52), rounded(10), py(16), px(24), bg('#F9F7F8'), flex, gap(10), itemsCenter, justifyCenter]}>
                    <TouchableOpacity>
                        <Image style={[image.w(15), image.h(20)]} source={images.locationImage} />
                    </TouchableOpacity>

                    <TextInput
                        style={[fs14, fw500, neurialGrotesk, h(20), { color: '#747474', borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }]}
                        placeholderTextColor={'#747474'}
                        cursorColor={'#747474'}
                        placeholder="Enter Location"
                        value=""
                    />

                    <TouchableOpacity>
                        <Image style={[image.w(22), image.h(22)]} source={images.pickUpImage} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    style={[wFull, h(46), flex, gap(16),]}
                    horizontal
                    data={DATA}
                    renderItem={({ item }) => (
                        <TouchableOpacity>
                            <View style={[w(98), hFull, rounded(100), py(16), px(32), gap(10), flex, itemsCenter, justifyCenter, { borderWidth: 1, borderColor: Colors.light.border }]}>
                                <Text style={[neurialGrotesk, fw500, fs12, colorBlack]}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => (
                        <View style={[w(16), hFull, bg(colors.transparent)]} />
                    )}
                    keyExtractor={(({ id }) => id.toString())}
                />
            </View>

            <View style={[flexCol, gap(20),]}>
                <View style={[wFull, flex, itemsCenter, justifyBetween]}>
                    <Text style={[neurialGrotesk, fw700, fs16, colorBlack]}>Drop off bus stop</Text>
                    <Text style={[neurialGrotesk, fw400, fs14, colorBlueBg]}>recent locations</Text>
                </View>

                <View style={[wFull, h(52), rounded(10), py(16), px(24), bg('#F9F7F8'), flex, gap(10), itemsCenter, justifyCenter]}>
                    <TouchableOpacity>
                        <Image style={[image.w(15), image.h(20)]} source={images.locationImage} />
                    </TouchableOpacity>

                    <TextInput
                        style={[fs14, fw500, neurialGrotesk, h(20), { color: '#747474', borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }]}
                        placeholderTextColor={'#747474'}
                        cursorColor={'#747474'}
                        placeholder="Enter Destination"
                        value=""
                    />

                    <TouchableOpacity>
                        <Image style={[image.w(22), image.h(24)]} source={images.dropOffImage} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    style={[wFull, h(46), flex, gap(16),]}
                    horizontal
                    data={DATA}
                    renderItem={({ item }) => (
                        <TouchableOpacity>
                            <View style={[w(98), hFull, rounded(100), py(16), px(32), gap(10), flex, itemsCenter, justifyCenter, { borderWidth: 1, borderColor: Colors.light.border }]}>
                                <Text style={[neurialGrotesk, fw500, fs12, colorBlack]}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => (
                        <View style={[w(16), hFull, bg(colors.transparent)]} />
                    )}
                    keyExtractor={(({ id }) => id.toString())}
                />
            </View>

            <TouchableOpacity>
                <View style={[wFull, h(50), rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.background)]}>
                    <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>Proceed</Text>

                    <Image style={[image.w(20), image.h(20)]} source={images.proceedCheckImage} />
                </View>
            </TouchableOpacity>
        </>
    )
};

const RecentLocations = () => {
    let [searching, setSearching] = useState(false);
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
        <>
            <View style={[flexCol, gap(20), relative]}>
                <View style={[wFull, flex, itemsCenter, justifyBetween]}>
                    <Text style={[neurialGrotesk, fw700, fs16, colorBlack]}>Pick up bus stop</Text>
                </View>

                <View style={[wFull, h(52), rounded(10), py(16), px(24), bg('#F9F7F8'), flex, gap(10), itemsCenter, justifyCenter]}>
                    <TouchableOpacity>
                        <Image style={[image.w(15), image.h(20)]} source={images.locationImage} />
                    </TouchableOpacity>

                    <TextInput
                        onFocus={() => setSearching(true)}
                        onBlur={() => setSearching(false)}
                        style={[fs14, fw500, neurialGrotesk, h(20), { color: '#747474', borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }]}
                        placeholderTextColor={'#747474'}
                        cursorColor={'#747474'}
                        placeholder="Enter Location"
                        value=""
                    />

                    <TouchableOpacity>
                        <Image style={[image.w(22), image.h(22)]} source={images.pickUpImage} />
                    </TouchableOpacity>
                </View>

                {searching && <View style={[relative, wFull, h(10), mt(-32)]}>
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

                    <FlatList
                        style={[wFull, h(75 * DATA.length), flexCol, gap(16),]}
                        horizontal={false}
                        data={DATA}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={[wFull]}>
                                <View style={[wFull, h(59), flex, itemsCenter, justifyBetween]}>
                                    <View style={[flexCol, itemsStart, gap(12)]}>
                                        <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{item.name}</Text>

                                        <Text style={[neurialGrotesk, fw400, fs12, c('#747474')]}>{`${item.name} ${item.name} ${item.name} ${item.name}`}</Text>
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
                                    style={[fs14, fw500, neurialGrotesk, h(20), { color: '#747474', borderColor: colors.transparent, borderWidth: 0, flex: 1 }]}
                                    placeholderTextColor={'#747474'}
                                    cursorColor={'#747474'}
                                    placeholder="Enter Location"
                                    value=""
                                />
                            </View>

                            <View style={[wFull, flex, itemsCenter, h(52), gap(10), px(24)]}>

                                <TouchableOpacity style={[]} >
                                    <Image style={[image.w(15), image.h(20)]} source={images.locationImage} />
                                </TouchableOpacity>

                                <Text style={[fs14, fw500, neurialGrotesk, c('#747474'), { borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }]}>Obafemi Awolowo Uni..</Text>
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
        </>
    )
}

const FilledForm = () => {

    return (
        <>
            <View style={[flexCol, gap(20),]}>
                <View style={[wFull, flex, itemsCenter, justifyBetween]}>
                    <Text style={[neurialGrotesk, fw700, fs16, colorBlack]}>Pick up bus stop</Text>
                </View>

                <View style={[wFull, h(52), rounded(10), py(16), px(24), bg('#F9F7F8'), flex, gap(10), itemsCenter, justifyCenter]}>
                    <TouchableOpacity>
                        <Image style={[image.w(15), image.h(20)]} source={images.locationImage} />
                    </TouchableOpacity>

                    <TextInput
                        style={[fs14, fw500, neurialGrotesk, h(20), { color: '#747474', borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }]}
                        placeholderTextColor={'#747474'}
                        cursorColor={'#747474'}
                        placeholder="Enter Location"
                        value=""
                    />
                </View>

            </View>

            <View style={[flexCol, gap(20),]}>
                <View style={[wFull, flex, itemsCenter, justifyBetween]}>
                    <Text style={[neurialGrotesk, fw700, fs16, colorBlack]}>Drop off bus stop</Text>
                </View>

                <View style={[wFull, h(52), rounded(10), py(16), px(24), bg('#F9F7F8'), flex, gap(10), itemsCenter, justifyCenter]}>
                    <TouchableOpacity>
                        <Image style={[image.w(15), image.h(20)]} source={images.locationImage} />
                    </TouchableOpacity>

                    <TextInput
                        style={[fs14, fw500, neurialGrotesk, h(20), { color: '#747474', borderColor: colors.transparent, borderWidth: 0, flex: 0.8 }]}
                        placeholderTextColor={'#747474'}
                        cursorColor={'#747474'}
                        placeholder="Enter Destination"
                        value=""
                    />
                </View>
            </View>

            <TouchableOpacity>
                <View style={[wFull, h(50), rounded(10), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.background)]}>
                    <Text style={[neurialGrotesk, fw700, fs18, colorWhite]}>Proceed</Text>

                    <Image style={[image.w(20), image.h(20)]} source={images.proceedCheckImage} />
                </View>
            </TouchableOpacity>
        </>
    )
}


function OrderRideBottomSheet() {
    let [currentView, setCurrentView] = useState(EViewStatus.filledForm);

    return (
        <PaddedScreen>
            <View style={[flexCol, gap(56), mt(20),]}>
                {currentView === EViewStatus.recentLocationsSnippet && <RecentLocationsSnippet />}

                {currentView === EViewStatus.recentLocations && <RecentLocations />}

                {currentView === EViewStatus.filledForm && <FilledForm />}
            </View>
        </PaddedScreen>
    )
}

export default OrderRideBottomSheet;