
interface IDriverNotificationMessage {
    title: string,
    content: string,
    read: boolean,
    driverId: string,
}

interface IDriverNotification {
    rideOrTripStatus: boolean,
    generalUpdates: boolean,
    promotionalOffers: boolean,
    tipsAndTutorials: boolean,
    transactionUpdates: boolean
}

interface IRating {
    driverId: string,
    count: number,
    comment: string,
    riderId: string
}

interface IPersonalDocuments {
    roadWorthinessCertImage: string,
    vehicleInsuranceCertImage: string,
    vehicleOwnershipCertImage: string,
    driverLicenseImage: string
}

interface IVehicleImage {
    frontViewImage: string,
    backViewImage: string,
    sideViewImage: string,
    interiorImage: string
}

interface IVehicle {
    id: string,
    vehicleType: string,
    vehicleYear: number,
    vehicleModel: string,
    vehicleColor: string,
    plateNumber: string,
    vehicleImages: IVehicleImage,
    seats: number
}

export interface IDriverDetails {
    personalDocuments: IPersonalDocuments,
    vehicle: IVehicle,
    ratingsIds: string[]
    isOnline: Boolean,
    notification: IDriverNotification,
    notificationMessagesIds: string[],
}