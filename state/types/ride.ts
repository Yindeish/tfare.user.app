type TLoadingStatus = 'idle' | 'succeeded' | 'failed';
type TLoadingType = string;
type TCurrentrideView = 'orderRide' | 'availableRides';
type TActiveTab = 'pending' | 'completed' | 'cancelled';
type TCounterFareStatus = 'idle' | 'pending' | 'accepted' | 'rejected';

type TBusStop = 'pickupBusstop' | 'dropoffBusstop';
export type TPlanName = 'standard' | 'premium';
export type TCategoryOrigin = 'ajah' | 'lekki' | 'obalende' | 'cms';
export type TCategoryDestination = 'lekki' | 'obalende' | 'cms' | 'oshodi';
export type TRideDirection = 'forward' | 'backward';
export type TRideStatus = 'requesting' | 'cancelled' | 'accepted' | 'declined' | 'started' | 'booked' | 'ended';

export interface IRoute {
    routeName: string;
    routeDesc: string;
    routeDistance: string;
}

export interface IBusStop {
    _id?: string,
    name: string,
    order?: {
        forward: { number: number },
        backward: { number: number }
    },
    category?: {
        origin: TCategoryOrigin,
        destination: TCategoryDestination,
    }
}

export interface ISavedBusStop {
    userId: string,
    busstopTitle: string,
    busStop: IBusStop,
}

export interface IRoute {
    _id: string,
    pickupBusstopId: string,
    dropoffBusstopId: string,
    rideDirection: 'forward' | 'backward',
    inTripDropoffsIds: string[]
}

export interface IRecentBusStop {
    userId: string,
    busStop: IBusStop,
}

export interface ILoading {
    status: TLoadingStatus;
    type: TLoadingType;
}

export interface ITicket {
    id?: string,
    owner?: {},
    pickupBusstop?: IBusStop | null,
    dropoffBusstop?: IBusStop | null,
    time?: string,
    sameAsFirstTicket?: boolean,
    number: number,
    userCounterFare?: number | null,
    rideFee?: number
}

export interface IDriverDetails {
    // vehiccle info
    // driver info
}

export interface IStateInput {
    pickupBusstopInput: IBusStop | null,
    dropoffBusstopInput: IBusStop | null,
    userCounterFareInput: number | null,
    driverRatingInput: number | null,
    driverRatingCommentInput: string,
    cancelRideReasonInput: string,
}
// ? Ride

export interface IPlan {
    planName: TPlanName,
    vehicleSeats: number,
    ride?: {
        rideFee: number
    },
    trip?: {
        tripFee: number
    }
}

export interface ICurrentRide {
    driverId: string,
    availableSeats: number,
    vehicleName: string,
    inRideDropoffsIds: string[],
    ridersRidesIds: string[],
}

export interface IRiderRideDetails {
    _id: string,
    pickupBusstopId: string,
    dropoffBusstopId: string,
    riderId: string,
    ticketsIds: string[],
    duration: string,
    ridePlan: IPlan
    rideStatus: TRideStatus,
    riderCounterOffer: number,
    currentRideId: string
}

export interface IRide {
    id?: string,
    pickupBusstop: IBusStop,
    dropoffBusstop: IBusStop,
    saved: boolean,
    tickets?: ITicket[] | [],
    status: 'idle' | 'cancelled' | 'accepted' | 'started',
    duration?: string,
    availableSeats?: number,
    seats?: number,
    driverDetails?: IDriverDetails,
    busStops?: IBusStop[] | [],
}

export interface IRideState {
    loading: ILoading,
    searchMatchBusstops: IBusStop[] | [],
    currentRideView: TCurrentrideView,
    userRide: IRiderRideDetails | null,
    availableRides: IRide[] | [],
    currentNumberOfTickets: number,
    activeTab: TActiveTab
    stateInput: IStateInput,
    currentTicket: ITicket | null,
    counterFareStatus: TCounterFareStatus,
    allTicketsFilled: boolean,
    duration: { text: string, value: string } | null,
    price: string,
    seats: number[],
}
// ? Ride

export type { TBusStop, TLoadingStatus, TLoadingType, TCurrentrideView, TActiveTab, TCounterFareStatus }