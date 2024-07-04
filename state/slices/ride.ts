import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ESlicesNames } from "../enums/slicesNames";
import { ILoading, IRideState, TCurrentrideView } from "../types/ride";


const initialState: IRideState = {
    dropoffBusstopInput: '',
    loading: {
        status: 'idle',
        type: ''
    },
    pickupBusstopInput: '',
    userProposedAmount: '',
    currentRideView: 'orderRide'
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
        setLoading: (state, action: PayloadAction<ILoading>) => {
            state.loading = action.payload;
        },
        setUserProposedAmount: (state, action: PayloadAction<number | string>) => {
            state.userProposedAmount = action.payload;
        },
        setCurrentRideView: (state, action: PayloadAction<TCurrentrideView>) => {
            state.currentRideView = action.payload;
        }
    }
})

export const { setDropoffBusstopInput, setLoading, setPickupBusstopInput, setUserProposedAmount, setCurrentRideView } = RideSlice.actions;

export default RideSlice.reducer;