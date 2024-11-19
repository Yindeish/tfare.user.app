import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ESlicesNames } from "../enums/slicesNames";
import { IBusStop, ILoading, IRide, IRiderRideDetails, IRideState, IStateInput, ITicket, TActiveTab, TCounterFareStatus, TCurrentrideView, } from "../types/ride";


const initialState: IRideState = {
    loading: {
        status: 'idle',
        type: ''
    },
    searchMatchBusstops: [],
    currentRideView: 'orderRide',
    availableRides: [
        // {
        //     id: '878dfgj',
        //     dropoffBusstop: {
        //         type: 'dropoffBusstop'
        //     },
        //     pickupBusstop: {
        //         type: 'pickupBusstop'
        //     },
        //     availableSeats: 2,
        //     seats: 3,
        //     status: 'idle',
        //     duration: '3-4hrs',
        //     saved: false,
        //     busStops: [],
        // },
        // {
        //     id: '8787ej',
        //     dropoffBusstop: {
        //         type: 'dropoffBusstop',
        //     },
        //     pickupBusstop: {
        //         type: 'pickupBusstop'
        //     },
        //     availableSeats: 3,
        //     seats: 6,
        //     status: 'idle',
        //     duration: '1-2hrs',
        //     saved: false,
        //     busStops: [],
        // },
        // {
        //     id: '87dgej',
        //     dropoffBusstop: {
        //         type: 'dropoffBusstop'
        //     },
        //     pickupBusstop: {
        //         type: 'pickupBusstop'
        //     },
        //     availableSeats: 1,
        //     seats: 3,
        //     status: 'idle',
        //     duration: '40-50mins',
        //     saved: false,
        //     busStops: [],
        // },
        // {
        //     id: 'jhdgej',
        //     dropoffBusstop: {
        //         type: 'dropoffBusstop'
        //     },
        //     pickupBusstop: {
        //         type: 'pickupBusstop'
        //     },
        //     availableSeats: 4,
        //     seats: 5,
        //     status: 'idle',
        //     duration: '20-30mins',
        //     saved: false,
        //     busStops: [],
        // },
        // {
        //     id: 'jhfdej',
        //     dropoffBusstop: {
        //         type: 'dropoffBusstop'
        //     },
        //     pickupBusstop: {
        //         type: 'pickupBusstop'
        //     },
        //     availableSeats: 0,
        //     seats: 4,
        //     status: 'idle',
        //     duration: '20-30mins',
        //     saved: false,
        //     busStops: [],
        // },
        // {
        //     id: 'jhdej',
        //     dropoffBusstop: {
        //         type: 'dropoffBusstop'
        //     },
        //     pickupBusstop: {
        //         type: 'pickupBusstop'
        //     },
        //     availableSeats: 3,
        //     seats: 5,
        //     status: 'idle',
        //     duration: '20-30mins',
        //     saved: false,
        //     busStops: [],
        // },
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
        setUserRide: (state, action: PayloadAction<IRiderRideDetails>) => {
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

            // if (state.userRide && state.userRide.tickets) {
            //     // Reset user tickets list
            //     state.userRide.tickets = []; //pop and push later; this is a bad practice. Having to refres te list

            //     for (let val = 0; val < currentNumberOfTickets; val++) {
            //         const newTicket: ITicket = {
            //             dropoffBusstop: (val + 1) === 1 ? { type: 'dropoffBusstop', routeName: state.stateInput.dropoffBusstopInput } : null, // setting the first ticket to use the underlying credentials
            //             pickupBusstop: (val + 1) === 1 ? { type: 'pickupBusstop', routeName: state.stateInput.pickupBusstopInput } : null, // setting the first ticket to use the underlying credentials
            //             owner: {},
            //             sameAsFirstTicket: (val + 1) === 1 ? true : false, // setting the first ticket to use the underlying credentials
            //             number: val + 1,
            //             userCounterFare: (val + 1) === 1 ? state.stateInput.userCounterFareInput : null
            //         }

            //         state.userRide.tickets = [...state.userRide?.tickets, newTicket];
            //     }
            // } else return;
        },
        toggleTicketAsFirstTicket: (state, action: PayloadAction<{ currentNumberOfTickets: number }>) => {
            const { currentNumberOfTickets } = action.payload;

            // if (state.userRide && state.userRide.tickets) {
            //     const firstTicket = state.userRide.tickets.find(ticket => Number(ticket.number) === 1);

            //     const ticket = state.userRide.tickets.find(ticket => Number(ticket.number) === Number(currentNumberOfTickets));

            //     if (ticket) {
            //         state.userRide.tickets = state.userRide.tickets.map((ticket,) => {

            //             if (Number(ticket.number) === Number(currentNumberOfTickets)) {

            //                 if (!ticket.sameAsFirstTicket) {
            //                     return {
            //                         ...firstTicket,
            //                         number: Number(currentNumberOfTickets)
            //                     }
            //                 } else {
            //                     return {
            //                         dropoffBusstop: null,
            //                         pickupBusstop: null,
            //                         sameAsFirstTicket: false,
            //                         number: Number(currentNumberOfTickets)
            //                     }
            //                 }
            //             } else return ticket
            //         }
            //         ) as ITicket[];
            //     }
            // }
        },
        editTicketBusstops: (state, action: PayloadAction<{ currentNumberOfTickets: number }>) => {
            const { currentNumberOfTickets } = action.payload;

            // if (state.userRide && state.userRide.tickets) {
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
    setAvailableRides,
    setUserRide, setSearchMatchBusstops,
    setCurrentNumberOfTickets, removeTicket, editTicketBusstops,
    setActiveTab, setStateInputField, createTicket, toggleTicketAsFirstTicket,
    setCurrentTicket, editTicketCounterFare, setCounterFareStatus,
    setAllTicketsFilled,
} = RideSlice.actions;

export default RideSlice.reducer;