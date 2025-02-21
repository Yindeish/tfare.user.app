import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ESlicesNames } from "../enums/slicesNames";
import { IBusStop, ICurrentRide, ILoading, IRide, IRiderRideDetails, IRideState, IStateInput, ITicketInput, TActiveTab, TCounterFareStatus, TCurrentrideView, } from "../types/ride";


const initialState: IRideState = {
    loading: {
        status: 'idle',
        type: ''
    },
    booking: false,
    searchMatchBusstops: [],
    currentRideView: 'orderRide',
    riderRideDetails: null,
    availableRides: [
    ],
    selectedAvailableRide: null,
    selectedAvailableRideId: null,
    paidTickets:[],
    driverDetails: null,
    ticketDetailsShown: false,
    // userRide: null,
    userRide: null,
    currentNumberOfTickets: 1,
    activeTab: 'completed',
    currentTicket: null,
    differentTickets: [],
    sameTickets: null,
    tripId: '',
    stateInput: {
        cancelRideReasonInput: '',
        driverRatingCommentInput: '',
        driverRatingInput: null,
        dropoffBusstopInput: null,
        pickupBusstopInput: null,
        userCounterFareInput: null,
        paymentOptionInput: 'wallet',
        userRideInput: {

        },

        // 
        selectedPlan: null
    },
    counterFareStatus: 'idle',
    allTicketsFilled: false,
    duration: null,
    price: '',
    seats: [],
    ridePlans: [],
    paymentOptionsVisible: false,

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
        setPaymentOptionsVisible: (state, action: PayloadAction<boolean>) => {
            state.paymentOptionsVisible = action.payload;
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
        setCurrentTicket: (state, action: PayloadAction<ITicketInput>) => {
            state.currentTicket = action.payload;
        },
        createTicket: (state, action: PayloadAction<{ currentNumberOfTickets: number }>) => {
            const { currentNumberOfTickets } = action.payload;

            // if (state.stateInput.userRideInput && state.stateInput.userRideInput?.tickets) {
                // Reset user tickets list
                
                state.stateInput.userRideInput.tickets = []; //pop and push later; this is a bad practice. Having to refres te list

                // console.log({'state.userRide': state.userRide})
                // for (let val = 0; val < currentNumberOfTickets; val++) {
                //     const newTicket: ITicketInput = {
                //         dropoffBusstop: (val + 1) === 1 ? state.stateInput.dropoffBusstopInput : null, // setting the first ticket to use the underlying credentials
                //         pickupBusstop: (val + 1) === 1 ? state.stateInput.pickupBusstopInput : null, // setting the first ticket to use the underlying credentials
                //         owner: {},
                //         sameAsFirstTicket: (val + 1) === 1 ? true : false, // setting the first ticket to use the underlying credentials
                //         number: val + 1,
                //         userCounterFare: (val + 1) === 1 ? state.stateInput.userCounterFareInput : null,
                //         rideFee: currentNumberOfTickets === 1 ? Number(state.userRide?.riderRideDetails?.riderCounterOffer) : null as never,
                //     }

                //     state.stateInput.userRideInput.tickets = [...state.stateInput.userRideInput?.tickets || [], newTicket];
                // }

                state.stateInput.userRideInput.tickets = []; //pop and push later; this is a bad practice. Having to refres te list

                for (let val = 0; val < (currentNumberOfTickets); val++) {
                    const newTicket: ITicketInput = {
                        dropoffBusstop: (val + 1) === 1 ? state.stateInput.dropoffBusstopInput : null, // setting the first ticket to use the underlying credentials
                        pickupBusstop: (val + 1) === 1 ? state.stateInput.pickupBusstopInput : null, // setting the first ticket to use the underlying credentials
                        owner: {},
                        ticketOtp: '',
                        sameAsFirstTicket: (val + 1) === 1 ? true : false, // setting the first ticket to use the underlying credentials
                        number: val + 1,
                        userCounterFare: (val + 1) === 1 ? state?.riderRideDetails?.riderCounterOffer : null,
                        // rideFee: (val + 1) === 1 ? Number(state?.riderRideDetails?.ridePlan?.plan?.ride?.rideFee) : null as never,
                        rideFee: (val + 1) === 1 ? Number(state?.riderRideDetails?.ridePlan?.ride?.rideFee || state?.riderRideDetails?.ridePlan?.plan?.ride?.rideFee) : null as never,
                    }

                    state.stateInput.userRideInput.tickets = [...state.stateInput.userRideInput?.tickets || [], newTicket];
                }
            // } else return;
        },
        toggleTicketAsFirstTicket: (state, action: PayloadAction<{ currentNumberOfTickets: number }>) => {
            const { currentNumberOfTickets } = action.payload;

            // if (state.userRide && state.stateInput.userRideInput.tickets) {
            if (state.stateInput.userRideInput.tickets) {
                console.log('condition met!')
                const firstTicket = state.stateInput.userRideInput.tickets.find(ticket => Number(ticket.number) === 1);
                console.log({ '___firstTicket___': firstTicket })

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
                    ) as ITicketInput[];
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
            //         ) as ITicketInput[];
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
            //         ) as ITicketInput[];
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
    setState, setPaymentOptionsVisible,
    setLoading, setCurrentRideView,
    setAvailableRides, setUserRideInput,
    setUserRide, setSearchMatchBusstops,
    setCurrentNumberOfTickets, removeTicket, editTicketBusstops,
    setActiveTab, setStateInputField, createTicket, toggleTicketAsFirstTicket,
    setCurrentTicket, editTicketCounterFare, setCounterFareStatus,
    setAllTicketsFilled,
} = RideSlice.actions;

export default RideSlice.reducer;