import { Image, StyleSheet, TextStyle, TouchableOpacity, View, ScrollView, TextInput } from 'react-native'
import { Text } from 'react-native-paper'
import React, { useEffect } from 'react'
import { bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, justifyStart, mb, mt, p, pb, pl, pr, px, py, relative, rounded, w, wFull, wHFull } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import { c, colorBlack, colorWhite, fs12, fs14, fs18, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import { image } from '@/utils/imageStyles'
import { images } from '@/constants/images'
import RideSelectors from '@/state/selectors/ride'
import { useAppDispatch } from '@/state/hooks/useReduxToolkit'
import Checkbox from 'expo-checkbox'
import { closeModal, openBottomSheet, openModal, setBottomSheetSnapPoint, setBottomSheetType } from '@/state/slices/layout'
import { ITicket } from '@/state/types/ride'
import { editTicketCounterFare, setCurrentTicket, setStateInputField, toggleTicketAsFirstTicket } from '@/state/slices/ride'
import CounterFareCtaBtn from './counterFareCtaBtn'
import { useBottomSheet } from '@/contexts/useBottomSheetContext'
import { TicketDetailsSheet } from './bookRideSheetComponent'

function Ticket({ index, ticket }: { index: number, ticket: ITicket }) {
    const dispatch = useAppDispatch();
    const { showBottomSheet } = useBottomSheet()
    const { currentTicket, userRide, stateInput: { pickupBusstopInput, dropoffBusstopInput, userCounterFareInput }, currentNumberOfTickets } = RideSelectors()


    // If ticket number is 1

    if (ticket.number === 1) {
        return (<View style={[wFull, flexCol, gap(32), mt(32)]}>
            <Text style={[colorBlack, neurialGrotesk, fw700, fs14]}>Ticket 1</Text>

            {/* Pick up block */}

            <View style={[wFull, flexCol, gap(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>
                <View style={[flexCol, gap(15)]}>
                    <View style={[flex, gap(12), itemsCenter]}>
                        <Image source={images.greenBgCoasterImage} style={[image.w(20), image.h(20)]} />

                        <Text style={[c(Colors.light.border), neurialGrotesk, fw400, fs12]}>Pick up Bus Stop</Text>
                    </View>

                    {/* <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{ticket.pickupBusstop?.routeName}</Text> */}
                    <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{ticket.pickupBusstop?.name}</Text>
                </View>
            </View>

            {/* Pick up block */}
            {/* Drop off block */}

            <View style={[wFull, flex, justifyBetween, pr(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>
                <View style={[flexCol, gap(15)]}>
                    <View style={[flex, gap(12), itemsCenter]}>
                        <Image source={images.redBgCoasterImage} style={[image.w(20), image.h(20)]} />

                        <Text style={[c(Colors.light.border), neurialGrotesk, fw400, fs12]}>Drop off Bus Stop</Text>
                    </View>

                    {/* <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{ticket.dropoffBusstop?.routeName}</Text> */}
                    <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{ticket.dropoffBusstop?.name}</Text>
                </View>

                <View style={[flexCol, gap(16), justifyStart]}>
                    <View style={[flex, itemsCenter, gap(8)]}>
                        <Image style={[image.w(14), image.h(11)]} source={images.rideOfferImage} />
                        <Text style={[c(Colors.light.textGrey), neurialGrotesk, fw400, fs12]}>Ticket fee</Text>
                    </View>

                    <Text style={[colorBlack, fw700, fs14]}>₦ {ticket?.rideFee}</Text>
                </View>
            </View>

            {/* Drop off block */}

        </View>)
    }

    else {
        return (
            <View style={[wFull, flexCol, gap(32), itemsStart, mt(40)]}>

                <View style={[flex, itemsCenter, gap(4)]}>
                    <Text style={[colorBlack, fw700, fs14,]}>{`Ticket ${ticket?.number}`}</Text>

                    <Text style={[fw400, fs12, c(Colors.light.textGrey)]}>(You have selected more than 1 seat)</Text>
                </View>

                {/* Ceckbox block for toggling same ticket as first ticket */}

                <View style={[flex, gap(12), itemsCenter]}>

                    <Checkbox
                        value={ticket.sameAsFirstTicket}
                        onValueChange={() => {
                            dispatch(toggleTicketAsFirstTicket({ currentNumberOfTickets: ticket.number }))
                        }
                        }
                        color={ticket.sameAsFirstTicket ? '#27AE65' : colors.grey500}
                    />

                    <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.textGrey)]}>Same pickup and dropoff as Ticket 1?</Text>
                </View>

                {/* Ceckbox block for toggling same ticket as first ticket */}

                {/* If the ticket's pick and drop of bus stops are not empty, Select ticket details shows otherwise Ticket pick up and drop off bus stop inputs show  */}

                {/* Select details block */}

                {!ticket.dropoffBusstop && !ticket.pickupBusstop && <TouchableOpacity onPress={() => {
                    dispatch(setCurrentTicket(ticket));

                    showBottomSheet([516, 601], <TicketDetailsSheet />)
                }}>
                    <View style={[w('auto'), h(50), p(16), rounded(100), flex, itemsCenter, justifyCenter, gap(10), bg(colors.white), { borderWidth: 0.7, borderColor: Colors.light.border }]}>
                        <Image style={[image.w(20), image.h(20)]} source={images.blackBgWaitChairImage} />

                        <Text style={[neurialGrotesk, fw500, fs12, colorBlack]}>Select Ticket Details</Text>
                    </View>
                </TouchableOpacity>}

                {/* Select details block */}

                {/* Bus Stop Inputs */}

                {ticket.dropoffBusstop && ticket.pickupBusstop &&
                    (<>
                        {/* Pick up block */}

                        <View style={[wFull, flexCol, gap(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>
                            <View style={[flexCol, gap(15)]}>
                                <View style={[flex, gap(12), itemsCenter]}>
                                    <Image source={images.greenBgCoasterImage} style={[image.w(20), image.h(20)]} />

                                    <Text style={[c(Colors.light.border), neurialGrotesk, fw400, fs12]}>Pick up Bus Stop</Text>
                                </View>

                                {/* <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{ticket.pickupBusstop.routeName}</Text> */}
                                <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{ticket.pickupBusstop.name}</Text>
                            </View>
                        </View>

                        {/* Pick up block */}
                        {/* Drop off block */}

                        <View style={[wFull, flex, justifyBetween, pr(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>
                            <View style={[flexCol, gap(15)]}>
                                <View style={[flex, gap(12), itemsCenter]}>
                                    <Image source={images.redBgCoasterImage} style={[image.w(20), image.h(20)]} />

                                    <Text style={[c(Colors.light.border), neurialGrotesk, fw400, fs12]}>Drop off Bus Stop</Text>
                                </View>

                                {/* <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{ticket.dropoffBusstop.routeName}</Text> */}
                                <Text style={[neurialGrotesk, fw700, fs14, colorBlack]}>{ticket.dropoffBusstop.name}</Text>
                            </View>

                            <View style={[flexCol, gap(16), justifyStart]}>
                                <View style={[flex, itemsCenter, gap(8)]}>
                                    <Image style={[image.w(14), image.h(11)]} source={images.rideOfferImage} />
                                    <Text style={[c(Colors.light.textGrey), neurialGrotesk, fw400, fs12]}>Ticket fee</Text>
                                </View>

                                <Text style={[colorBlack, fw700, fs14,]}>₦ {ticket.rideFee}</Text>
                            </View>
                        </View>

                        {/* Drop off block */}

                        {/* Counter fare block */}

                       {!ticket.sameAsFirstTicket && <View style={[wFull, flexCol, gap(16), pb(16), { borderBottomWidth: 0.7, borderBottomColor: Colors.light.border }]}>

                            <Text style={[c(Colors.light.textGrey), neurialGrotesk, fw400, fs12,]}>Want to send a counter offer? </Text>

                            <View style={[wFull, flex, justifyBetween]}>
                                <View style={[flex, gap(16), itemsCenter, justifyStart, w('57%'), h(50), pl(16), rounded(10), bg(colors.white), { borderWidth: 0.7, borderColor: Colors.light.border }]}>
                                    <Image
                                        style={[image.w(14), image.h(10)]}
                                        source={images.rideOfferImage}
                                    />

                                    <View style={[flex, itemsCenter,]}>
                                        <Text style={[c(Colors.light.textGrey), fs14, fw500]}>₦</Text>
                                        <TextInput
                                            onFocus={() => dispatch(setCurrentTicket(ticket))}
                                            onChangeText={(text) => () => {
                                                dispatch(setStateInputField({ key: 'userCounterFareInput', value: text }))
                                                dispatch(editTicketCounterFare({ currentNumberOfTickets: Number(currentTicket?.number) }))
                                            }}
                                            value={userCounterFareInput?.toString()}
                                            placeholder={'Negotiate fare'}
                                            style={[py(16) as TextStyle, pr(10) as TextStyle, , bg(colors.transparent) as TextStyle, c(Colors.light.textGrey), fs14, fw500, h(50) as TextStyle, { borderWidth: 0, borderColor: colors.transparent, flex: 0.9 }]}

                                            cursorColor={Colors.light.background}
                                            selectionColor={colors.transparent}
                                            keyboardType={'numeric'}
                                            underlineColorAndroid={colors.transparent}
                                            placeholderTextColor={Colors.light.textGrey}
                                        />
                                    </View>
                                </View>

                                <CounterFareCtaBtn />

                            </View>

                            {true && <View style={[wFull, flex, itemsCenter, justifyStart, gap(12)]}>
                                <Image style={[image.w(20), image.h(21), { objectFit: 'contain' }]} source={images.cautionImage} />

                                <Text style={[neurialGrotesk, fw400, fs12, c(Colors.light.error)]}>
                                    Offer too low to work with
                                </Text>
                            </View>}
                        </View>}

                        {/* Counter fare block */}
                    </>)}

                {/* Bus Stop Inputs */}
            </View>)
    }

}

export default Ticket;