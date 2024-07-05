import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ESlicesNames } from "../enums/slicesNames";
import { IBusStop, ILoading, IRide, IRideState, ISeat, TCurrentrideView, TTicketAsTicket1 } from "../types/ride";


const initialState: IRideState = {
    dropoffBusstopInput: '',
    loading: {
        status: 'idle',
        type: ''
    },
    searchMatchBusstops: [],
    pickupBusstopInput: '',
    userProposedAmount: '',
    currentRideView: 'orderRide',
    addAnotherTicket: false,
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
    ],
    userRides: [],
    userSelectedSeats: [],
    ticketAsTicket1: null,
    // seats: []
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
        setUserProposedAmount: (state, action: PayloadAction<number | string>) => {
            state.userProposedAmount = action.payload;
        },
        setCurrentRideView: (state, action: PayloadAction<TCurrentrideView>) => {
            state.currentRideView = action.payload;
        },
        setAddAnother: (state, action) => {
            state.addAnotherTicket = action.payload;
        },
        setAvailableRides: (state, action) => {
            state.availableRides = action.payload;
        },
        setUserRides: (state, action: PayloadAction<IRide[] | []>) => {
            state.userRides = action.payload;
        },
        setUserSelectedSeats: (state, action: PayloadAction<ISeat[] | []>) => {
            state.userSelectedSeats = action.payload;
        },
        setTicketAsTicket1: (state, action: PayloadAction<TTicketAsTicket1 | null>) => {
            state.ticketAsTicket1 = action.payload;
        },
        setSeats: (state, action: PayloadAction<ISeat[] | []>) => {
            // state.seats = action.payload;
        }
    }
})

export const { setDropoffBusstopInput, setLoading, setPickupBusstopInput, setUserProposedAmount, setCurrentRideView, setAddAnother, setAvailableRides, setUserRides, setUserSelectedSeats, setTicketAsTicket1, setSearchMatchBusstops, setSeats } = RideSlice.actions;

export default RideSlice.reducer;