import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ESlicesNames } from "../enums/slicesNames";
import { IBusStop, ICurrentRide, ILoading, IRide, IRiderRideDetails, IRideState, IStateInput, ITicket, TActiveTab, TCounterFareStatus, TCurrentrideView, } from "../types/ride";


const initialState: IRideState = {
    loading: {
        status: 'idle',
        type: ''
    },
    searchMatchBusstops: [],
    currentRideView: 'orderRide',
    availableRides: [
    ],
    // userRide: null,
    userRide: null,
    currentNumberOfTickets: 1,
    activeTab: 'completed',
    currentTicket: null,
    stateInput: {
        cancelRideReasonInput: '',
        driverRatingCommentInput: '',
        driverRatingInput: null,
        dropoffBusstopInput: null,
        pickupBusstopInput: null,
        userCounterFareInput: null,
        userRideInput: {

        }
    },
    counterFareStatus: 'idle',
    allTicketsFilled: false,
    duration: null,
    price: '',
    seats: [],
}

const RideSlice = createSlice({
    name: ESlicesNames.ride,
    initialState,
    reducers: {
        setState: (state, action: PayloadAction<{ key: keyof IRideState, value: any }>) => {
            const { key, value } = action.payload;
            state[key] = value as never;
        },
        setStateInputField: (state, action: PayloadAction<{ key: keyof IStateInput, value: any }>) => {
            const { key, value } = action.payload;
            state.stateInput[key] = value as never;
        },
        setUserRideInput: (state, action: PayloadAction<IRide>) => {
            state.stateInput.userRideInput = action.payload;
        },
        setSearchMatchBusstops: (state, action: PayloadAction<IBusStop[] | []>) => {
            state.searchMatchBusstops = action.payload;
        },
        setLoading: (state, action: PayloadAction<ILoading>) => {
            state.loading = action.payload;
        },
        setCurrentRideView: (state, action: PayloadAction<TCurrentrideView>) => {
            state.currentRideView = action.payload;
        },
        setAvailableRides: (state, action) => {
            state.availableRides = action.payload;
        },
        // setUserRide: (state, action: PayloadAction<IR÷iderRideDetails>) => {
        setUserRide: (state, action: PayloadAction<{riderRideDetails: IRiderRideDetails, currentRide: ICurrentRide}>) => {
            state.userRide = action.payload;
        },
        setCurrentNumberOfTickets: (state, action: PayloadAction<number>) => {
            state.currentNumberOfTickets = action.payload;
        },
        setCurrentTicket: (state, action: PayloadAction<ITicket>) => {
            state.currentTicket = action.payload;
        },
        createTicket: (state, action: PayloadAction<{ currentNumberOfTickets: number }>) => {
            const { currentNumberOfTickets } = action.payload;

            // if (state.stateInput.userRideInput && state.stateInput.userRideInput?.tickets) {
                // Reset user tickets list
                state.stateInput.userRideInput.tickets = []; //pop and push later; this is a bad practice. Having to refres te list

                for (let val = 0; val < currentNumberOfTickets; val++) {
                    const newTicket: ITicket = {
                        dropoffBusstop: (val + 1) === 1 ? state.stateInput.dropoffBusstopInput : null, // setting the first ticket to use the underlying credentials
                        pickupBusstop: (val + 1) === 1 ? state.stateInput.pickupBusstopInput : null, // setting the first ticket to use the underlying credentials
                        owner: {},
                        sameAsFirstTicket: (val + 1) === 1 ? true : false, // setting the first ticket to use the underlying credentials
                        number: val + 1,
                        userCounterFare: (val + 1) === 1 ? state.stateInput.userCounterFareInput : null
                    }

                    state.stateInput.userRideInput.tickets = [...state.stateInput.userRideInput?.tickets || [], newTicket];
                    console.log({ '___newTicket___': newTicket, 'tickets':state.stateInput.userRideInput.tickets })
                }
            // } else return;
        },
        toggleTicketAsFirstTicket: (state, action: PayloadAction<{ currentNumberOfTickets: number }>) => {
            const { currentNumberOfTickets } = action.payload;

            if (state.userRide && state.stateInput.userRideInput.tickets) {
                const firstTicket = state.stateInput.userRideInput.tickets.find(ticket => Number(ticket.number) === 1);

                const ticket = state.stateInput.userRideInput.tickets.find(ticket => Number(ticket.number) === Number(currentNumberOfTickets));

                if (ticket) {
                    state.stateInput.userRideInput.tickets = state.stateInput.userRideInput.tickets.map((ticket,) => {

                        if (Number(ticket.number) === Number(currentNumberOfTickets)) {

                            if (!ticket.sameAsFirstTicket) {
                                return {
                                    ...firstTicket,
                                    number: Number(currentNumberOfTickets)
                                }
                            } else {
                                return {
                                    dropoffBusstop: null,
                                    pickupBusstop: null,
                                    sameAsFirstTicket: false,
                                    number: Number(currentNumberOfTickets)
                                }
                            }
                        } else return ticket
                    }
                    ) as ITicket[];
                }
            }
        },
        editTicketBusstops: (state, action: PayloadAction<{ currentNumberOfTickets: number }>) => {
            const { currentNumberOfTickets } = action.payload;

            // if (state.stateInput.userRideInput && state.userRide.tickets) {
            //     const ticket = state.userRide.tickets.find(ticket => Number(ticket.number) === Number(currentNumberOfTickets));

            //     if (ticket) {
            //         state.userRide.tickets = state.userRide.tickets.map((ticket,) => {

            //             if (Number(ticket.number) === Number(currentNumberOfTickets)) {

            //                 return {
            //                     ...ticket,
            //                     pickupBusstop: {
            //                         type: 'pickupBusstop',
            //                         routeName: state.stateInput.pickupBusstopInput,
            //                     },
            //                     dropoffBusstop: {
            //                         type: 'dropoffBusstop',
            //                         routeName: state.stateInput.dropoffBusstopInput,
            //                     },
            //                     sameAsFirstTicket: false
            //                 }
            //             } else return ticket
            //         }
            //         ) as ITicket[];
            //     } else return;
            // } else return;
        },
        editTicketCounterFare: (state, action: PayloadAction<{ currentNumberOfTickets: number }>) => {
            const { currentNumberOfTickets } = action.payload;

            // if (state.userRide && state.userRide.tickets) {
            //     const ticket = state.userRide.tickets.find(ticket => Number(ticket.number) === Number(currentNumberOfTickets));

            //     if (ticket) {
            //         state.userRide.tickets = state.userRide.tickets.map((ticket,) => {

            //             if (Number(ticket.number) === Number(currentNumberOfTickets)) {

            //                 return {
            //                     ...ticket,
            //                     userCounterFare: state.stateInput.userCounterFareInput
            //                 }
            //             } else return ticket
            //         }
            //         ) as ITicket[];
            //     } else return;
            // } else return;
        },
        removeTicket: (state, action: PayloadAction<{ currentNumberOfTickets: number }>) => {

        },
        setActiveTab: (state, action: PayloadAction<TActiveTab>) => {
            state.activeTab = action.payload
        },
        setCounterFareStatus: (state, action: PayloadAction<TCounterFareStatus>) => {
            state.counterFareStatus = action.payload;
        },
        setAllTicketsFilled: (state, action) => {
            state.allTicketsFilled = action.payload;
        },
    }
})

export const {
    setState,
    setLoading, setCurrentRideView,
    setAvailableRides, setUserRideInput,
    setUserRide, setSearchMatchBusstops,
    setCurrentNumberOfTickets, removeTicket, editTicketBusstops,
    setActiveTab, setStateInputField, createTicket, toggleTicketAsFirstTicket,
    setCurrentTicket, editTicketCounterFare, setCounterFareStatus,
    setAllTicketsFilled,
} = RideSlice.actions;

export default RideSlice.reducer;