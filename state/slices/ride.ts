import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ESlicesNames } from "../enums/slicesNames";
import { IBusStop, ILoading, IRide, IRideState, ISeat, ITicket, TAddTicketStatus, TCurrentrideView, TTicketAsTicket1 } from "../types/ride";


const initialState: IRideState = {
    dropoffBusstopInput: '',
    loading: {
        status: 'idle',
        type: ''
    },
    searchMatchBusstops: [],
    pickupBusstopInput: '',
    userCounterFare: null,
    currentRideView: 'orderRide',
    addTicketStatus: 'idle',
    availableRides: [
        {
            id: '#878dfgj',
            dropoffBusstop: {
                type: 'dropoffBusstop'
            },
            pickupBusstop: {
                type: 'pickupBusstop'
            },
            availableSeats: [
                { available: true, no: 1, selected: false },
                { available: true, no: 3, selected: false },
            ],
            seats: [
                { available: true, no: 1, selected: false },
                { available: false, no: 2, selected: false },
                { available: true, no: 3, selected: false },
            ],
            status: 'idle',
            duration: '3-4hrs',
            saved: false
        },
        {
            id: '#8787ej',
            dropoffBusstop: {
                type: 'dropoffBusstop',
            },
            pickupBusstop: {
                type: 'pickupBusstop'
            },
            availableSeats: [
                { available: true, no: 1, selected: false },
            ],
            seats: [
                { available: true, no: 1, selected: false },
                { available: false, no: 2, selected: false },
                { available: false, no: 3, selected: false },
                { available: false, no: 4, selected: false },
                { available: false, no: 5, selected: false },
            ],
            status: 'idle',
            duration: '1-2hrs',
            saved: false
        },
        {
            id: '#87dgej',
            dropoffBusstop: {
                type: 'dropoffBusstop'
            },
            pickupBusstop: {
                type: 'pickupBusstop'
            },
            availableSeats: [
                { available: true, no: 1, selected: false },
                { available: true, no: 4, selected: false },
            ],
            seats: [
                { available: true, no: 1, selected: false },
                { available: false, no: 2, selected: false },
                { available: false, no: 3, selected: false },
                { available: true, no: 4, selected: false },
            ],
            status: 'idle',
            duration: '40-50mins',
            saved: false
        },
        {
            id: '#jhdgej',
            dropoffBusstop: {
                type: 'dropoffBusstop'
            },
            pickupBusstop: {
                type: 'pickupBusstop'
            },
            availableSeats: [
                { available: true, no: 1, selected: false },
                { available: true, no: 3, selected: false },
                { available: true, no: 4, selected: false },
                { available: true, no: 6, selected: false },
            ],
            seats: [
                { available: true, no: 1, selected: false },
                { available: false, no: 2, selected: false },
                { available: true, no: 3, selected: false },
                { available: true, no: 4, selected: false },
                { available: false, no: 5, selected: false },
                { available: true, no: 6, selected: false },
            ],
            status: 'idle',
            duration: '20-30mins',
            saved: false
        },
        {
            id: '#jhfdej',
            dropoffBusstop: {
                type: 'dropoffBusstop'
            },
            pickupBusstop: {
                type: 'pickupBusstop'
            },
            availableSeats: [
                { available: true, no: 1, selected: false },
                { available: true, no: 3, selected: false },
                { available: true, no: 4, selected: false },
                { available: true, no: 6, selected: false },
            ],
            seats: [
                { available: true, no: 1, selected: false },
                { available: false, no: 2, selected: false },
                { available: true, no: 3, selected: false },
                { available: true, no: 4, selected: false },
                { available: false, no: 5, selected: false },
                { available: true, no: 6, selected: false },
            ],
            status: 'idle',
            duration: '20-30mins',
            saved: false
        },
        {
            id: '#jhdej',
            dropoffBusstop: {
                type: 'dropoffBusstop'
            },
            pickupBusstop: {
                type: 'pickupBusstop'
            },
            availableSeats: [
                { available: true, no: 1, selected: false },
                { available: true, no: 3, selected: false },
                { available: true, no: 4, selected: false },
                { available: true, no: 6, selected: false },
            ],
            seats: [
                { available: true, no: 1, selected: false },
                { available: false, no: 2, selected: false },
                { available: true, no: 3, selected: false },
                { available: true, no: 4, selected: false },
                { available: false, no: 5, selected: false },
                { available: true, no: 6, selected: false },
            ],
            status: 'idle',
            duration: '20-30mins',
            saved: false
        },
    ],
    userSelectedSeats: [],
    ticketAsTicket1: null,
    userRide: null,
    currentSeat: null,
}

const RideSlice = createSlice({
    name: ESlicesNames.ride,
    initialState,
    reducers: {
        setPickupBusstopInput: (state, action: PayloadAction<string>) => {
            state.pickupBusstopInput = action.payload;
        },
        setDropoffBusstopInput: (state, action: PayloadAction<string>) => {
            state.dropoffBusstopInput = action.payload;
        },
        setSearchMatchBusstops: (state, action: PayloadAction<IBusStop[] | []>) => {
            state.searchMatchBusstops = action.payload;
        },
        setLoading: (state, action: PayloadAction<ILoading>) => {
            state.loading = action.payload;
        },
        setUserCounterFare: (state, action: PayloadAction<number | null>) => {
            state.userCounterFare = action.payload;
        },
        setCurrentRideView: (state, action: PayloadAction<TCurrentrideView>) => {
            state.currentRideView = action.payload;
        },
        setAddTicketStatus: (state, action: PayloadAction<TAddTicketStatus>) => {
            state.addTicketStatus = action.payload;
        },
        setAvailableRides: (state, action) => {
            state.availableRides = action.payload;
        },
        setUserRide: (state, action: PayloadAction<IRide | null>) => {
            state.userRide = action.payload;
        },
        setUserSelectedSeats: (state, action: PayloadAction<ISeat[] | []>) => {
            state.userSelectedSeats = action.payload;
        },
        setTicketAsTicket1: (state, action: PayloadAction<TTicketAsTicket1 | null>) => {
            state.ticketAsTicket1 = action.payload;
        },
        setCurrentSeat: (state, action: PayloadAction<number>) => {
            const seat = state.userRide?.seats?.find(seat => seat.no === action.payload);

            state.currentSeat = seat as ISeat;
        },
        selectSeat: (state, action: PayloadAction<number>) => {
            const seatSelected = (state.userRide?.seats as ISeat[]).find(seat => seat?.no === action.payload)?.selected;

            if (!seatSelected) {
                if (state.userRide && state.userRide.seats) {
                    const updatedSeats = state.userRide.seats.map(seat => {
                        if (seat.no === action.payload) {
                            return {
                                ...seat,
                                selected: true,
                                available: true
                            };
                        } else {
                            return seat;
                        }
                    });

                    state.userRide.seats = updatedSeats;
                }

            }
            else return;
        },
        unselectSeat: (state, action: PayloadAction<number>) => {
            const seatSelected = (state.userRide?.seats as ISeat[]).find(seat => seat?.no === action.payload)?.selected;

            if (seatSelected) {
                if (state.userRide && state.userRide.seats) {
                    const updatedSeats = state.userRide.seats.map(seat => {
                        if (seat.no === action.payload) {
                            return {
                                ...seat,
                                selected: false,
                                available: true
                            };
                        } else {
                            return seat;
                        }
                    });

                    state.userRide.seats = updatedSeats;
                }

            }
            else return;
        },
        createTicket: (state, action: PayloadAction<{ seatNo: number, subsequentTicket: boolean }>) => {
            const { seatNo, subsequentTicket } = action.payload;
            const ticketInRide = (state.userRide?.tickets as ITicket[]).find(ticket => ticket?.seat?.no === seatNo);

            if (!ticketInRide) {
                if (state.userRide && state.userRide.tickets) {
                    const updatedUserRide: IRide = {
                        ...state.userRide,
                        tickets: [
                            ...state.userRide?.tickets as ITicket[], {
                                seat: {
                                    no: seatNo,
                                    selected: true,
                                    available: true
                                },
                                owner: {},
                                pickupBusstop: state.userRide.tickets.length === 0 ?
                                    {
                                        routeName: state.pickupBusstopInput,
                                        type: 'pickupBusstop'
                                    }
                                    : null,
                                dropoffBusstop: state.userRide.tickets.length === 0 ? {
                                    routeName: state.dropoffBusstopInput,
                                    type: 'dropoffBusstop'
                                } : null,
                            }
                        ]
                    }

                    state.userRide = updatedUserRide;
                }
            }
        },
        editTicket: (state, action: PayloadAction<number>) => {
            const { payload } = action;
            const matchTicket = state.userRide?.tickets?.find(ticket => ticket?.seat?.no === payload);

            (matchTicket as ITicket).pickupBusstop = {
                type: 'pickupBusstop',
                routeName: state.pickupBusstopInput
            };

            (matchTicket as ITicket).dropoffBusstop = {
                type: 'dropoffBusstop',
                routeName: state.dropoffBusstopInput
            }

            state.userRide?.tickets?.map(ticket => {
                if (matchTicket?.seat?.no === payload) {
                    return {
                        ...ticket,
                        ...matchTicket
                    }
                }
            })
        },
        removeTicket: (state, action: PayloadAction<number>) => {
            const ticketInRide = (state.userRide?.tickets as ITicket[]).find(ticket => ticket?.seat?.no === action.payload);

            if (ticketInRide) {
                if (state.userRide && state.userRide.tickets) {
                    const updatedRideTicket = state.userRide.tickets.filter((ride) => ride?.seat?.no !== action.payload);

                    state.userRide = {
                        ...state.userRide,
                        tickets: updatedRideTicket
                    }
                }
            }
        }
    }
})

export const { setDropoffBusstopInput, setLoading, setPickupBusstopInput, setUserCounterFare, setCurrentRideView, setAddTicketStatus, setAvailableRides, setUserRide, setUserSelectedSeats, setTicketAsTicket1, setSearchMatchBusstops, createTicket, selectSeat, setCurrentSeat, unselectSeat, removeTicket, editTicket } = RideSlice.actions;

export default RideSlice.reducer;