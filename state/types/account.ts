import { IFlutterwaveWallet, } from "./flutterwaveWallet";
import { IBusStop, ILoading, ISavedBusStop } from "./ride";

type TProfileCta = 'edit' | 'save';

interface IUserNotification {
    orderStatus: boolean,
    generalUpdates: boolean,
    promotionalOffers: boolean,
    tipsAndTutorials: boolean,
    transactionUpdates: boolean,
}

interface IUserWallet extends Partial<IFlutterwaveWallet> {
}

interface IRider {
    notification: IUserNotification,
    emergencyContactsIds: string[],
    savedAddresses: ISavedBusStop[]
}

interface IUser {
    __v: number,
    _id: string,
    createdAt: Date,
    deactivated: boolean,
    deleted: boolean,
    otpExpires: Date,
    gender: string,
    picture: string,
    avatar: string,
    otp: string,
    email: string,
    password: string,
    phoneNumber: string,
    fullName: string,
    profileName: string,
    role: string,
    updatedAt: Date,
    riderProfile?: IRider,
}

interface IUserAccount {
    name: string,
    userName: string,
    email: string,
    phoneNo: number,
    picture?: Blob,
    auth?: {
        biometricLogin: boolean,
    },
    status?: 'deactivated' | 'deleted',
    deactivationReason?: string,
    notifications?: IUserNotification,
    wallet?: IUserWallet,
}

interface EmergencyContact extends
    Pick<IUserAccount, 'name' | 'email' | 'phoneNo'> {
    whatsAppNo: number
}

interface IAddress extends Partial<IBusStop> {
    name: string,
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
    imageInput: string,
    avatarInput: string
}

interface IStateInputAddNewContact {
    contactNameInput: string,
    contactEmailInput: string,
    contactPhoneNumberInput: string,
    contactWhatsAppInput: string,
}

interface IStateInputSaveNewAddress {
    userIdInput: string,
    busstopTitleInput: string,
    busStopInput: IBusStop | null,
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
    emergencyContacts: EmergencyContact[] | [],
    savedAddresses: IAddress[] | [],
    profileCta: TProfileCta,
}

export type {
    IUserNotification, IUserWallet,
    EmergencyContact, IAddress,
    IAccountState, IStateInput,
    IStateInputAcountSecurity,
    IStateInputAddNewContact,
    IStateInputDeactivateAccount,
    IStateInputNotifications,
    IStateInputProfile, IStateInputSaveNewAddress,
    TProfileCta, IUserAccount,
    IUser,
}