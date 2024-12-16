import { IFlutterwaveWallet, } from "./flutterwaveWallet";
import { IBusStop, ILoading } from "./ride";

type TProfileCta = 'edit' | 'save';

interface IUserAccountNotification {
    orderStatus: boolean,
    generalUpdates: boolean,
    promotionalOffers: boolean,
    tipsAndTutorials: boolean,
    transactionUpdates: boolean,
}

// interface IUserAccountWallet extends Partial<IFlutterwaveWallet> {
// }
interface IUserAccountWallet {
    userId: string,
    account_number: string,
    account_status: string,
    bank_name: string,
    expiry_date: string,
    note: string,
    balance: string
}

interface IUserAccount {
    fullName: string,
    userName: string,
    email: string,
    phoneNumber: number,
    picture?: string,
    avatar?: string,
    auth?: {
        biometricLogin: boolean,
    },
    status?: 'deactivated' | 'deleted',
    deactivationReason?: string,
    notifications?: IUserAccountNotification,
    wallet?: IUserAccountWallet,
}

interface IEmergencyContact extends
    Pick<IUserAccount, 'email' | 'phoneNumber'> {
    name: string,
    whatsAppNo: number
}

interface IAddress {
    userId: string,
    busstopTitle: string,
    busStop: IBusStop,
}

interface IStateInput {
    profile: IStateInputProfile,
    addNewContact: IStateInputAddNewContact,
    saveNewAddress: IStateInputSaveNewAddress,
    accountSecurity: IStateInputAcountSecurity,
    notifications: IStateInputNotifications,
    deactivateAccount: IStateInputDeactivateAccount
}

interface IStateInputProfile {
    nameInput: string,
    userNameInput: string,
    emailInput: string,
    phoneNoInput: string,
}

interface IStateInputAddNewContact {
    contactNameInput: string,
    contactEmailInput: string,
    contactPhoneNumberInput: string,
    contactWhatsAppInput: string,
}

interface IStateInputSaveNewAddress extends Pick<IBusStop, 'name'> {
    addressName: string,
}

interface IStateInputAcountSecurity {
    biometricLoginInput: boolean
}

interface IStateInputNotifications {
    orderStatusInput: boolean,
    generalUpdatesInput: boolean,
    promotionalOffersInput: boolean,
    tipsAndTutorialsInput: boolean,
    transactionUpdatesInput: boolean,
}

interface IStateInputDeactivateAccount {
    reasonInput: string
}

interface IAccountState {
    loading: ILoading | null,
    stateInput: IStateInput,
    userAccount: IUserAccount | null,
    emergencyContacts: IEmergencyContact[] | [],
    savedAddresses: IAddress[] | [],
    profileCta: TProfileCta,
}

export type {
    IUserAccountNotification, IUserAccountWallet,
    IEmergencyContact, IAddress,
    IAccountState, IStateInput,
    IStateInputAcountSecurity,
    IStateInputAddNewContact,
    IStateInputDeactivateAccount,
    IStateInputNotifications,
    IStateInputProfile, IStateInputSaveNewAddress,
    TProfileCta, IUserAccount
}