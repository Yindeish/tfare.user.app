import { View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import { image, mXAuto, wHFull } from '@/utils/imageStyles'
import PaddedScreen from '@/components/shared/paddedScreen'
import PageTitle from '@/components/shared/pageTitle'
import { router } from 'expo-router'
import { bg, flex, flexCol, gap, h, itemsCenter, itemsStart, mr, pt, px, py, rounded, w, wFull } from '@/utils/styles'
import { images } from '@/constants/images'
import { c, colorBlack, fs12, fs14, fs16, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import { tabs } from '@/constants/tabs'
import Colors from '@/constants/Colors'
import { Text } from 'react-native-paper'
import DriverProfileListTile from '@/components/page/driverProfileListTile'
import { FlatList } from 'react-native-gesture-handler'

export default function
    () {
    return (
        <SafeScreen>
            <View style={[wHFull]}>
                <PaddedScreen>

                    {/* Page Header */}

                    <PageTitle
                        title='Driver Profile'
                        onPress={() => router.push(`/(tab)/${tabs.offer}`)}
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
                                source={images.userProfileImage}
                                style={[image.w(90), image.h(90), image.rounded(90), image.mx('auto')]}
                            />

                            <Text style={[mXAuto, fw700, fs16, colorBlack]}>Tom Hawkins</Text>

                            <View style={[flex, gap(32), itemsCenter, mXAuto]}>
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

                            <View style={[flex, itemsCenter, gap(20), mXAuto]}>
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

                            <DriverProfileListTile text={{ leading: 'Car Model', trailing: 'Honda Accord' }} />

                            <DriverProfileListTile text={{ leading: 'Car Package', trailing: 'Premium Ride' }} />

                            <DriverProfileListTile text={{ leading: 'Plate Number', trailing: 'ABJ-123-XY' }} />

                            <DriverProfileListTile text={{ leading: 'Color', trailing: 'Red' }} />

                            <DriverProfileListTile text={{ leading: 'Phone Number', trailing: '+2347012345678' }} />

                            <View style={[wFull, flexCol, itemsStart, gap(20), mr(28)]}>

                                <Text style={[c(Colors.light.textGrey), neurialGrotesk, fs14, fw400]}>Vehicle Images</Text>

                                <FlatList
                                    contentContainerStyle={[h(100)]}
                                    data={[images.bannerImage, images.bannerImage, images.bannerImage]}
                                    renderItem={({ index, item }) => (
                                        <Image style={[image.w(100), image.h(100)]} source={item} />
                                    )}
                                    horizontal
                                    ItemSeparatorComponent={() => (<View style={[w(11)]} />)}
                                />
                            </View>
                        </View>
                    </View>
                </PaddedScreen>
            </View>
        </SafeScreen>
    )
}