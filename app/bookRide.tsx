

import { Image, ScrollView, StyleSheet, TextStyle, TouchableOpacity, View, } from 'react-native'
import { Text } from 'react-native-paper'
import React from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import { bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, justifyStart, mb, mt, p, pr, px, py, relative, rounded, w, wFull, wHFull } from '@/utils/styles'
import PageFloatingTitle from '@/components/page/pageFloatingTitle'
import { router } from 'expo-router'
import Colors, { colors } from '@/constants/Colors'
import { c, colorBlack, colorWhite, fs12, fs14, fs18, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import { image } from '@/utils/imageStyles'
import { images } from '@/constants/images'
import { FontAwesome6 } from '@expo/vector-icons'
import { pages } from '@/constants/pages'
import RideBlock from '@/components/page/rideBlock'
import PaddedScreen from '@/components/shared/paddedScreen'
import { FlatList } from 'react-native-gesture-handler'
import RideSelectors from '@/state/selectors/ride'
import { useAppDispatch } from '@/state/hooks/useReduxToolkit'
import { setAddAnother, setTicketAsTicket1, setUserRide } from '@/state/slices/ride'
import Checkbox from 'expo-checkbox'
import BottomSheetModal from '@/components/shared/bottomSheetModal'
import { closeModal, openModal } from '@/state/slices/layout'
import { IRide, ISeat, ITicket } from '@/state/types/ride'

const { sharedStyle, availableSeatStyle, selectedSeatStyle, unavailableSeatStyle } = StyleSheet.create({
    sharedStyle: {
        ...w(45), ...h(45), ...rounded(100), ...p(16), ...flex, ...itemsCenter, ...justifyCenter,
        borderWidth: 0.7, borderColor: Colors.light.border
    },
    availableSeatStyle: {
        ...bg('#F9F7F8'),
    },
    unavailableSeatStyle: {
        ...bg(Colors.light.border)
    },
    selectedSeatStyle: {
        ...bg(Colors.light.background)
    }
});

export default function BookRide() {
    const dispatch = useAppDispatch();
    const { addAnotherTicket, userRide, ticketAsTicket1, pickupBusstopInput, dropoffBusstopInput } = RideSelectors()

    const selectSeat = (seatNo: number) => {
        // create ticket for seat
        if (userRide?.tickets) {
            const ticketExist = (userRide?.tickets as ITicket[]).find(ticket => ticket?.seat?.no === seatNo && ticket?.seat?.selected);

            if (!ticketExist) {
                dispatch(setUserRide({
                    ...userRide as IRide,
                    tickets: [...userRide?.tickets as ITicket[], {
                        seat: {
                            no: seatNo,
                            selected: true,
                            available: false
                        },
                        owner: {}
                    }]
                }))
            }
            else return;
        }

        else {
            dispatch(setUserRide({
                ...userRide as IRide,
                tickets: [{
                    seat: {
                        no: seatNo,
                        selected: true,
                        available: false
                    },
                    owner: {}
                }]
            }))
        }

    }

    return (
        <SafeScreen>
            <View style={[relative]}>

                {/* Page Title */}
                <PageFloatingTitle
                    title='Book Ride'
                    color={{ icon: Colors.light.textGrey, text: colors.black }}
                    onPress={() => router.back()}
                    view={false}
                />
                {/* Page Title */}

                <ScrollView >
                    <View style={[wHFull, mt(120), flexCol, gap(32), mb(32)]}>

                        <RideBlock
                            ride={userRide as IRide}
                            bgColor='#FFF7E6'
                            ctaType='trackRide'
                            touchable
                            roundedCorners={false}
                            onPress={() => { }}
                        />

                        <PaddedScreen>
                            <View style={[wFull, h(99), flexCol, gap(16), { borderBottomColor: Colors.light.border, borderBottomWidth: 0.7 }]}>
                                <View style={[wFull, flex, itemsCenter, gap(12)]}>
                                    <Image style={[image.w(20), image.h(13)]} source={images.ticketImage} />

                                    <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey)]}>Tickets</Text>
                                </View>

                                <FlatList
                                    data={userRide?.seats}
                                    horizontal
                                    renderItem={({ item: { no, selected, available } }) => (
                                        <>
                                            {available ? (<TouchableOpacity
                                                onPress={() => selectSeat(no)}
                                                style={[sharedStyle, selected ? selectedSeatStyle : availableSeatStyle]} key={no}>
                                                <Text style={[neurialGrotesk, fw400, fs14, { color: `${selected ? colors.white : colors.black}` }]}>{no}</Text>
                                            </TouchableOpacity>)
                                                :
                                                <View style={[sharedStyle, unavailableSeatStyle]} key={no}>
                                                    <Text style={[neurialGrotesk, fw400, fs14, { color: `${selected ? colors.white : colors.black}` }]}>{no}</Text>
                                                </View>}
                                        </>
                                    )}
                                    ItemSeparatorComponent={() => (<View style={[w(24)]} />)}
                                    keyExtractor={({ no }) => no.toString()}
                                />
                            </View>

                            <View style={[wFull, flexCol, gap(32), mt(32)]}>
                                <Text style={[colorBlack, neurialGrotesk, fw700, fs14]}>Ticket 1</Text>

                                {/* Pick up block */}

                                <View style={[wFull, flexCol, gap(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>
                                    <View style={[flexCol, gap(15)]}>
                                        <View style={[flex, gap(12), itemsCenter]}>
                                            <Image source={images.greenBgCoasterImage} style={[image.w(20), image.h(20)]} />

                                            <Text style={[c(Colors.light.border), neurialGrotesk, fw400, fs12]}>Pick up Bus Stop</Text>
                                        </View>

                                        <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{pickupBusstopInput}</Text>
                                    </View>
                                </View>

                                {/* Pick up block */}
                                {/* Drop off block */}

                                <View style={[wFull, flex, justifyBetween, pr(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>
                                    <View style={[flexCol, gap(15)]}>
                                        <View style={[flex, gap(12), itemsCenter]}>
                                            <Image source={images.redBgCoasterImage} style={[image.w(20), image.h(20)]} />

                                            <Text style={[c(Colors.light.border), neurialGrotesk, fw400, fs12]}>Pick up Bus Stop</Text>
                                        </View>

                                        <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{pickupBusstopInput}</Text>
                                    </View>

                                    <View style={[flexCol, gap(16), justifyStart]}>
                                        <View style={[flex, itemsCenter, gap(8)]}>
                                            <Image style={[image.w(14), image.h(11)]} source={images.rideOfferImage} />
                                            <Text style={[c(Colors.light.textGrey), neurialGrotesk, fw400, fs12]}>Ticket fee</Text>
                                        </View>

                                        <Text style={[colorBlack, fw700, fs14, neurialGrotesk]}> ₦ 550.00</Text>
                                    </View>
                                </View>
                                {/* Drop off block */}

                            </View>

                            {/* Add another ticket btn */}

                            {!addAnotherTicket && <TouchableOpacity onPress={() => dispatch(setAddAnother(true))}>
                                <View style={[w('50%'), h(50), mt(32), rounded(100), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.background)]}>
                                    <Image style={[image.w(20), image.h(20)]} source={images.waitChairImage} />

                                    <Text style={[neurialGrotesk, fw500, fs12, colorWhite]}>Add another ticket</Text>
                                </View>
                            </TouchableOpacity>}

                            {/* Add another ticket btn */}

                            {/* New ticket Block */}

                            {addAnotherTicket && <View style={[wFull, flexCol, gap(32), itemsStart, mt(40)]}>

                                <View style={[flex, itemsCenter, gap(4)]}>
                                    <Text style={[colorBlack, fw700, fs14, neurialGrotesk]}>{`Ticket 2`}</Text>

                                    <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey)]}>(You have selected more than 1 seat)</Text>
                                </View>

                                <View style={[flex, gap(12), itemsCenter]}>

                                    <Checkbox
                                        value={ticketAsTicket1 ? true : false}
                                        onValueChange={() => dispatch(!ticketAsTicket1 ? setTicketAsTicket1({
                                            id: '1'
                                        })
                                            :
                                            setTicketAsTicket1(null))
                                        }
                                        color={ticketAsTicket1 ? '#27AE65' : colors.grey500}
                                    />

                                    <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey)]}>Same pickup and dropoff as Ticket 1?</Text>
                                </View>

                                {!ticketAsTicket1 && <TouchableOpacity onPress={() => dispatch(openModal())}>
                                    <View style={[w('auto'), h(50), p(16), rounded(100), flex, itemsCenter, justifyCenter, gap(10), bg(colors.white), { borderWidth: 0.7, borderColor: Colors.light.border }]}>
                                        <Image style={[image.w(20), image.h(20)]} source={images.blackBgWaitChairImage} />

                                        <Text style={[neurialGrotesk, fw500, fs12, colorBlack]}>Select Ticket Details</Text>
                                    </View>
                                </TouchableOpacity>}

                                {ticketAsTicket1 && <>
                                    {/* Pick up block */}

                                    <View style={[wFull, flexCol, gap(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>
                                        <View style={[flexCol, gap(15)]}>
                                            <View style={[flex, gap(12), itemsCenter]}>
                                                <Image source={images.greenBgCoasterImage} style={[image.w(20), image.h(20)]} />

                                                <Text style={[c(Colors.light.border), neurialGrotesk, fw400, fs12]}>Pick up Bus Stop</Text>
                                            </View>

                                            <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{pickupBusstopInput}</Text>
                                        </View>
                                    </View>

                                    {/* Pick up block */}
                                    {/* Drop off block */}

                                    <View style={[wFull, flex, justifyBetween, pr(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>
                                        <View style={[flexCol, gap(15)]}>
                                            <View style={[flex, gap(12), itemsCenter]}>
                                                <Image source={images.redBgCoasterImage} style={[image.w(20), image.h(20)]} />

                                                <Text style={[c(Colors.light.border), neurialGrotesk, fw400, fs12]}>Pick up Bus Stop</Text>
                                            </View>

                                            <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{pickupBusstopInput}</Text>
                                        </View>

                                        <View style={[flexCol, gap(16), justifyStart]}>
                                            <View style={[flex, itemsCenter, gap(8)]}>
                                                <Image style={[image.w(14), image.h(11)]} source={images.rideOfferImage} />
                                                <Text style={[c(Colors.light.textGrey), neurialGrotesk, fw400, fs12]}>Ticket fee</Text>
                                            </View>

                                            <Text style={[colorBlack, fw700, fs14, neurialGrotesk]}> ₦ 550.00</Text>
                                        </View>
                                    </View>
                                    {/* Drop off block */}

                                    {/* Add another ticket btn */}

                                    <TouchableOpacity onPress={() => {
                                        dispatch(setUserRide({
                                            pickupBusstop: {
                                                type: 'pickupBusstop'
                                            },
                                            dropoffBusstop: {
                                                type: 'dropoffBusstop'
                                            },
                                            saved: false,
                                            status: 'idle'
                                        }))

                                        dispatch(setAddAnother(true));
                                    }}>
                                        <View style={[w('auto'), p(16), mt(32), rounded(100), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.background)]}>
                                            <Image style={[image.w(20), image.h(20)]} source={images.waitChairImage} />

                                            <Text style={[neurialGrotesk, fw500, fs12, colorWhite]}>Add another ticket</Text>
                                        </View>
                                    </TouchableOpacity>

                                    {/* Add another ticket btn */}
                                </>}

                            </View>}

                            {/* New ticket Block */}

                            {/* BottomSheet */}

                            <BottomSheetModal onDismiss={() => {
                                // dispatch(setBottomSheetSnapPoint(-1));
                                // router.push(`/${pages.availableRides}`)
                                dispatch(closeModal())
                            }}>
                                <View>
                                    <Text>hijk jhjasdkk</Text>
                                    <Text>hijk jhjasdkk</Text>
                                </View>
                            </BottomSheetModal>

                            {/* BottomSheet */}
                        </PaddedScreen>
                    </View>
                </ScrollView>
            </View>
        </SafeScreen>
    )
}
