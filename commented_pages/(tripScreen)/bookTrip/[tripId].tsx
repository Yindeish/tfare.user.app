import { Image, View, TouchableOpacity, ScrollView, FlatList, StyleSheet } from 'react-native'
import { Text, } from 'react-native-paper'
import React, { useEffect } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import { image, imgAbsolute, mYAuto, wHFull } from '@/utils/imageStyles'
import { absolute, b, bg, borderGrey, borderL, borderR, flex, flexCenter, flexCol, gap, h, itemsCenter, justifyBetween, justifyCenter, l, maxh, mb, ml, mr, mt, my, p, pb, pl, px, py, relative, rounded, w, wFull, zIndex } from '@/utils/styles'
import Colors, { colors } from '@/constants/Colors'
import PaddedScreen from '@/components/shared/paddedScreen'
import { images } from '@/constants/images'
import { c, colorBlack, colorWhite, fs12, fs14, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import { Href, router } from 'expo-router'
import PageTitle from '@/components/shared/pageTitle'
import TripBlock from '@/components/shared/tripBlock';
import CtaBtn from '@/components/shared/ctaBtn';
import { useBottomSheet } from '@/contexts/useBottomSheetContext';
import { useLocalSearchParams } from 'expo-router'
import { pages } from '@/constants/pages'
import RideSelectors from '@/state/selectors/ride'
import { useAppDispatch } from '@/state/hooks/useReduxToolkit'
import { createTicket, setAllTicketsFilled, setCurrentNumberOfTickets, } from '@/state/slices/ride'
import Ticket from '@/components/page/ticket'
import { indices } from '@/constants/zIndices'
import { Ionicons } from '@expo/vector-icons'
import BuyTicketListTile from '@/components/page/buyTicketListTile'
import { TripBookedSheet } from '@/components/page/bookTripSheetComponent'


const { sharedStyle, availableSeatStyle, selectedSeatStyle, unavailableSeatStyle } = StyleSheet.create({
    sharedStyle: {
        ...w(45), ...h(45), ...rounded(100), ...flex, ...itemsCenter, ...justifyCenter,
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

function BookTrip() {
    const { rideId } = useLocalSearchParams();

    const { showBottomSheet } = useBottomSheet()
    const dispatch = useAppDispatch();
    const { userRide, allTicketsFilled, stateInput: { pickupBusstopInput, dropoffBusstopInput }, currentNumberOfTickets } = RideSelectors()

    // create a single ticket based on the default number of tickets
    useEffect(() => {
        if (currentNumberOfTickets === 1) {
            dispatch(createTicket({ currentNumberOfTickets: 1 }))
        }
    }, [currentNumberOfTickets])
    // create a single ticket based on the default number of tickets

    const selectNumberOfTickets = (ticketNumber: number) => {
        dispatch(setCurrentNumberOfTickets(ticketNumber))

        dispatch(createTicket({ currentNumberOfTickets: ticketNumber }))
    }

    // check if all tickets have been filled
    // useEffect(() => {
    //     if (userRide && userRide?.ticket) {
    //         const allTciketsFilled = userRide?.tickets.every(ticket =>
    //             ticket.dropoffBusstop && ticket.dropoffBusstop &&
    //             ticket.dropoffBusstop.routeName !== '' && ticket.dropoffBusstop.routeName !== '');

    //         if (allTciketsFilled) dispatch(setAllTicketsFilled(true))
    //         else dispatch(setAllTicketsFilled(false))
    //     }
    // }, [userRide?.tickets])
    // check if all tickets have been filled


    return (
        <SafeScreen>
            <ScrollView style={[]}>
                {/* //!Page Header */}
                <PaddedScreen>

                    <PageTitle
                        title='Book Trip'
                        onPress={() => router.back()}
                    />

                </PaddedScreen>
                {/* //!Page Header */}

                {/* //!Trip Block */}
                <TripBlock />
                {/* //!Trip Block */}

                {/* //! */}
                <PaddedScreen>

                    <FlatList
                        horizontal={false}
                        // data={userRide?.tickets}
                        data={[]}
                        renderItem={({ index, item: ticket }) => (
                            <Ticket ticket={ticket} index={index} key={index} />
                        )}
                    />

                    {/* Add another ticket btn */}

                    {/* 5 is the seats (total) and 3 is the available seats */}
                    {currentNumberOfTickets < 3 && <TouchableOpacity onPress={() => {
                        dispatch(setCurrentNumberOfTickets(currentNumberOfTickets + 1))
                        dispatch(createTicket({ currentNumberOfTickets: currentNumberOfTickets + 1 }))
                    }}>
                        <View style={[w('50%'), h(50), mt(32), rounded(100), flex, itemsCenter, justifyCenter, gap(10), bg(Colors.light.background)]}>
                            <Image style={[image.w(20), image.h(20)]} source={images.waitChairImage} />

                            <Text style={[neurialGrotesk, fw500, fs12, colorWhite]}>Add another ticket</Text>
                        </View>
                    </TouchableOpacity>}

                    {/* Add another ticket btn */}

                    {/* Shows when all the tickets have been filled (counter fare are optional) */}
                    {/* Buy Ticket Btn */}

                    {allTicketsFilled && <View style={[absolute, zIndex(indices.xHigh), b('30%'), l(20), wFull]}>
                        <CtaBtn
                            img={{
                                src: images.whiteBgTicketImage,
                                w: 22, h: 14
                            }}
                            onPress={() => showBottomSheet([700], <TripBookedSheet rideId='1' />)}
                            text={{
                                name: 'Buy Ticket',
                                color: colors.white
                            }}
                            bg={{
                                color: Colors.light.background
                            }}
                        />
                    </View>}

                    {/* Buy Ticket Btn */}

                    {/* Shows when buy ticket cta btn is clicked */}

                    {/* Payment options */}

                    <View style={[wFull, flexCol, gap(16), mt(32), mb(30)]}>
                        <View style={[wFull, flexCol, gap(16), pb(16), { borderBottomColor: Colors.light.border, borderBottomWidth: 0.7 }]}>

                            <TouchableOpacity
                                onPress={() => {
                                    router.push(`/(tripScreen)/paymentOptions/1` as Href)
                                }}
                                style={[wFull, flex, justifyBetween, itemsCenter]}>
                                <Text style={[neurialGrotesk, fs14, fw700, colorBlack]}>Pay with</Text>

                                <View style={[flex, gap(16), itemsCenter]}>
                                    <Text style={[neurialGrotesk, fw400, fs14, colorBlack]}>Wallet</Text>

                                    <Ionicons name="chevron-forward" size={20} color={Colors.light.textGrey} />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={[wFull, flex, justifyBetween, itemsCenter]}>
                                <Text style={[neurialGrotesk, fs14, fw700, c(Colors.light.border)]}>Offers</Text>

                                <View style={[flex, gap(16), itemsCenter]}>
                                    <Text style={[neurialGrotesk, fw400, fs14, c(Colors.light.border)]}>Unavailable</Text>

                                    <Ionicons name="chevron-forward" size={20} color={Colors.light.border} />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={[wFull, flexCol, gap(16), pb(16), { borderBottomColor: Colors.light.border, borderBottomWidth: 0.7 }]}>
                            <BuyTicketListTile
                                leadingText='Trip ID'
                                trailing={{
                                    text: '#1234567ABC',
                                }}
                            />
                            <BuyTicketListTile
                                leadingText='Trip Cost'
                                trailing={{
                                    text: ' ₦ 500.00',
                                }}
                            />
                            <BuyTicketListTile
                                leadingText='Discount'
                                trailing={{
                                    text: ' ₦ 0000.00',
                                }}
                            />
                        </View>

                        <BuyTicketListTile
                            leadingText='Total'
                            trailing={{
                                text: ' ₦ 500.00',
                            }}
                        />
                    </View>

                    {/* Payment options */}
                </PaddedScreen>
                {/* //! */}

            </ScrollView>

        </SafeScreen>
    )
}

export default BookTrip;