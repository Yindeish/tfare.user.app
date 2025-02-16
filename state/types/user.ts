export type TUser = 'driver' | 'rider' | 'admin';

export interface IAccountSecurity {
    pin: string,
    securityQuestion: string,
    securityAnswer: string,
    deactivationReason: string,
    deactivated: boolean,
    deleted: boolean,
    bvn: Number,
    otp: string,
    otpExpires: Date,
    biometricLogin: boolean
}

export interface IRiderNotification {
    rideStatus: boolean,
    generalUpdates: boolean,
    promotionalOffers: boolean,
    tipsAndTutorials: boolean,
    transactionUpdates: boolean
}

export interface IRider {
    notification: IRiderNotification,
}

export interface IDriver {
    personalDocuments: IPersonalDocuments,
    vehicle: IVehicle,
    // ratingsIds: string[]
    isOnline: Boolean,
    notification: IDriverNotification,
    // notificationMessagesIds: string[],
}

export interface IDriverNotification {
    rideOrTripStatus: boolean,
    generalUpdates: boolean,
    promotionalOffers: boolean,
    tipsAndTutorials: boolean,
    transactionUpdates: boolean
}

export interface IPersonalDocuments {
    roadWorthinessCertImage: string,
    vehicleInsuranceCertImage: string,
    vehicleOwnershipCertImage: string,
    driverLicenseImage: string
}

export interface IVehicleImage {
    frontViewImage: string,
    backViewImage: string,
    sideViewImage: string,
    interiorImage: string
}

export interface IVehicle {
    id: string,
    vehicleType: string,
    vehicleYear: number,
    vehicleModel: string,
    vehicleColor: string,
    plateNumber: string,
    vehicleImages: IVehicleImage,
    seats: number
}

export interface IUser {
    _id: string,
    email: string,
    address: string,
    profileName: string,
    fullName: string,
    phoneNumber: Number,
    picture: string,
    avatar: string,
    accountSecurity: IAccountSecurity,
    role: TUser,
    riderProfile?: IRider,
    driverProfile?: IDriver,
}
