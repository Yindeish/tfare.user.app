import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ESlicesNames } from "../enums/slicesNames";
import { IAccountState, IAddress, IStateInput, IStateInputAcountSecurity, IStateInputAddNewContact, IStateInputDeactivateAccount, IStateInputNotifications, IStateInputProfile, IStateInputSaveNewAddress, IUserAccount, IUserAccountNotification, IUserAccountWallet, TProfileCta } from "../types/account";


const accountSecurity: IStateInputAcountSecurity = {
    biometricLoginInput: false
}

const addNewContact: IStateInputAddNewContact = {
    contactEmailInput: '',
    contactNameInput: '',
    contactPhoneNumberInput: '',
    contactWhatsAppInput: ''
};

const deactivateAccount: IStateInputDeactivateAccount = {
    reasonInput: ''
};

const notifications: IStateInputNotifications = {
    generalUpdatesInput: false,
    orderStatusInput: false,
    promotionalOffersInput: false,
    tipsAndTutorialsInput: false,
    transactionUpdatesInput: false
};

const profile: IStateInputProfile = {
    emailInput: '',
    nameInput: '',
    phoneNoInput: '',
    userNameInput: '',
};

const saveNewAddress: IStateInputSaveNewAddress = {
    addressName: '',
    routeName: ''
};

const initialState: IAccountState = {
    emergencyContacts: [
        {
            email: 'one@gmail.com',
            name: 'one',
            phoneNo: 8899879,
            whatsAppNo: 9808023,
        },
        {
            email: 'one@gmail.com',
            name: 'one',
            phoneNo: 8899879,
            whatsAppNo: 9808023,
        },
        {
            email: 'one@gmail.com',
            name: 'one',
            phoneNo: 8899879,
            whatsAppNo: 9808023,
        },
    ],
    loading: null,
    savedAddresses: [
        {
            name: 'badagry',
            routeDesc: 'badagry desc',
            routeDistance: '3km',
            routeName: 'badagry rd',
            saved: true,
            type: 'pickupBusstop'
        },
        {
            name: 'ojo',
            routeDesc: 'ojo desc',
            routeDistance: '3km',
            routeName: 'ojo rd',
            saved: true,
            type: 'dropoffBusstop'
        },
    ],
    userAccount: null,
    profileCta: 'edit',
    stateInput: {
        accountSecurity,
        addNewContact,
        deactivateAccount,
        notifications,
        profile,
        saveNewAddress
    }
}

const accountSlice = createSlice({
    name: ESlicesNames.account,
    initialState,
    reducers: {
        setEmergencyContactField: (state, action: PayloadAction<{ key: keyof IStateInputAddNewContact, value: string }>) => {
            const { key, value } = action.payload;
            state.stateInput.addNewContact[key] = value;
        },

        seLoading: (state, action) => { },

        setSaveAddressesField: (state, action: PayloadAction<{ key: keyof IStateInputSaveNewAddress, value: string }>) => {
            const { key, value } = action.payload;
            state.stateInput.saveNewAddress[key] = value;
        },

        setSavedAddresses: (state, action: PayloadAction<IAddress[]>) => {
            state.savedAddresses = action.payload;
        },

        setUserAccount: (state, action: PayloadAction<IUserAccount>) => {
            state.userAccount = action.payload;
        },

        setUserWallet: (state, action: PayloadAction<IUserAccountWallet>) => {
            if (state.userAccount) state.userAccount.wallet = action.payload;
        },

        setUserNotificationField: (state, action: PayloadAction<{ key: keyof IStateInputNotifications, value: boolean }>) => {
            const { key, value } = action.payload;
            state.stateInput.notifications[key] = value;
        },

        setProfileCta: (state, action: PayloadAction<TProfileCta>) => {
            state.profileCta = action.payload;
        },

        setUserProfileInfoFeild: (state, action: PayloadAction<{ key: keyof IStateInputProfile, value: string }>) => {
            const { key, value } = action.payload;
            state.stateInput.profile[key] = value;
        },

        setUserAccountSecurityFeild: (state, action: PayloadAction<{ key: keyof IStateInputAcountSecurity, value: boolean }>) => {
            const { key, value } = action.payload;
            state.stateInput.accountSecurity[key] = value;
        },

        setUserProfileInfo: (state,) => {
            if (state.userAccount) {
                const { emailInput, nameInput, phoneNoInput, userNameInput } = state.stateInput.profile;
                state.userAccount = {
                    email: emailInput,
                    name: nameInput,
                    phoneNo: Number(phoneNoInput),
                    userName: userNameInput,
                }
            }
        },

        setUserNotifications: (state, action: PayloadAction<IUserAccountNotification>) => {
            if (state.userAccount) {
                state.userAccount.notifications = action.payload;
            }
        },

        setUserNotificationsFromStateInput: (state) => {
            if (state.userAccount && state.userAccount?.notifications) {
                const { generalUpdatesInput, orderStatusInput, promotionalOffersInput, tipsAndTutorialsInput, transactionUpdatesInput } = state.stateInput.notifications;
                state.userAccount.notifications = {
                    generalUpdates: generalUpdatesInput,
                    orderStatus: orderStatusInput,
                    promotionalOffers: promotionalOffersInput,
                    tipsAndTutorials: tipsAndTutorialsInput,
                    transactionUpdates: transactionUpdatesInput,
                }
            }
        },

        setDeactivateAccountField: (state, action: PayloadAction<{ key: keyof IStateInputDeactivateAccount, value: string }>) => {
            const { key, value } = action.payload;
            state.stateInput.deactivateAccount[key] = value;
        }
    }
})

export const {
    seLoading, setSavedAddresses,
    setEmergencyContactField,
    setProfileCta, setUserProfileInfo,
    setSaveAddressesField, setUserNotificationField,
    setUserWallet, setUserProfileInfoFeild,
    setUserNotifications, setUserNotificationsFromStateInput,
    setUserAccount, setUserAccountSecurityFeild,
    setDeactivateAccountField,
} = accountSlice.actions;

export default accountSlice.reducer;