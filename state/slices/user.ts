import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ESlicesNames } from "../enums/slicesNames";
import { IAccountState, IAddress, IStateInput, IStateInputAcountSecurity, IStateInputAddNewContact, IStateInputDeactivateAccount, IStateInputNotifications, IStateInputProfile, IStateInputSaveNewAddress, IUserAccount, IUserAccountNotification, IUserAccountWallet, TProfileCta } from "../types/account";

interface IState {
    wallet: {
        balance: null | number
    },
    inputState: {},
}

const initialState: IState = {
    wallet: {
        balance: null
    },
    inputState: {}
}

const accountSlice = createSlice({
    name: ESlicesNames.user,
    initialState,
    reducers: {
        setWalletState: (state, action: PayloadAction<{ key: keyof IState['wallet'], value: any }>) => {
            const { key, value } = action.payload;
            state.wallet[key] = value;
        },
        setInputState: (state, action: PayloadAction<{ key: keyof IState['inputState'], value: any }>) => {
            const { key, value } = action.payload;
            state.inputState[key] = value as never;
        }
    }
})

export const {
    setInputState, setWalletState
} = accountSlice.actions;

export default accountSlice.reducer;