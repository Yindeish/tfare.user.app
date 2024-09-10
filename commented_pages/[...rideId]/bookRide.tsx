import { Image, StyleSheet, TextStyle, TouchableOpacity, View, ScrollView } from 'react-native'
import { Text } from 'react-native-paper'
import React, { useEffect } from 'react'
import SafeScreen from '@/components/shared/safeScreen'
import { absolute, b, bg, flex, flexCol, gap, h, hFull, itemsCenter, itemsStart, justifyBetween, justifyCenter, justifyStart, l, mb, mt, p, pb, pr, px, py, relative, rounded, w, wFull, wHFull, zIndex } from '@/utils/styles'
import PageFloatingTitle from '@/components/page/pageFloatingTitle'
import { Href, router, useLocalSearchParams } from 'expo-router'
import Colors, { colors } from '@/constants/Colors'
import { c, colorBlack, colorWhite, fs12, fs14, fs18, fw400, fw500, fw700, neurialGrotesk } from '@/utils/fontStyles'
import { image } from '@/utils/imageStyles'
import { images } from '@/constants/images'
import { pages } from '@/constants/pages'
import RideBlock from '@/components/page/rideBlock'
import PaddedScreen from '@/components/shared/paddedScreen'
import { FlatList } from 'react-native-gesture-handler'
import RideSelectors from '@/state/selectors/ride'
import { useAppDispatch } from '@/state/hooks/useReduxToolkit'
import { createTicket, setAllTicketsFilled, setCurrentNumberOfTickets, } from '@/state/slices/ride'
import { IRide, } from '@/state/types/ride'
import Ticket from '@/components/page/ticket'
import CtaBtn from '@/components/shared/ctaBtn'
import { indices } from '@/constants/zIndices'
import { Ionicons } from '@expo/vector-icons'
import BuyTicketListTile from '@/components/page/buyTicketListTile'

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

export default function BookRide() {
    const { rideId } = useLocalSearchParams();

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
    useEffect(() => {
        if (userRide && userRide?.tickets) {
            const allTciketsFilled = userRide?.tickets.every(ticket =>
                ticket.dropoffBusstop && ticket.dropoffBusstop &&
                ticket.dropoffBusstop.routeName !== '' && ticket.dropoffBusstop.routeName !== '');

            if (allTciketsFilled) dispatch(setAllTicketsFilled(true))
            else dispatch(setAllTicketsFilled(false))
        }
    }, [userRide?.tickets])
    // check if all tickets have been filled

    return (
        <SafeScreen>
            <ScrollView style={[wHFull, relative, { overflow: 'scroll' }]}>

                {/* Page Title */}
                <PageFloatingTitle
                    title='Book Ride'
                    color={{ icon: Colors.light.textGrey, text: colors.black }}
                    onPress={() => router.push(`/${pages.availableRides}` as Href)}
                    view={false}
                />
                {/* Page Title */}

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

                            <ScrollView>
                                <View style={[wFull, flex, gap(16)]}>
                                    {/* 5 is the seats (total) and 3 is the available seats */}
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <View key={index}>
                                            {index + 1 <= 3 ? (<TouchableOpacity
                                                onPress={() => selectNumberOfTickets(index + 1)}
                                                style={[sharedStyle, currentNumberOfTickets === index + 1 ? selectedSeatStyle : availableSeatStyle]}>
                                                <Text style={[fw400, fs14, c(`${currentNumberOfTickets === index + 1 ? colors.white : colors.black}`)]}>{index + 1}</Text>
                                            </TouchableOpacity>)
                                                :
                                                <View style={[sharedStyle, unavailableSeatStyle]}>
                                                    <Text style={[fw400, fs14, c(`${currentNumberOfTickets === index + 1 ? colors.white : colors.black}`),]}>{index + 1}</Text>
                                                </View>}
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>

                        </View>

                        <FlatList
                            horizontal={false}
                            data={userRide?.tickets}
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
                                onPress={() => { }}
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

                        <View style={[wFull, flexCol, gap(16), mt(32)]}>
                            <View style={[wFull, flexCol, gap(16), pb(16), { borderBottomColor: Colors.light.border, borderBottomWidth: 0.7 }]}>

                                <TouchableOpacity
                                    onPress={() => {
                                        console.log('rideID', rideId)
                                        router.push(`/${pages.paymentOptions}/${rideId}` as Href)
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
                </View>
            </ScrollView>
        </SafeScreen>
    )
}
