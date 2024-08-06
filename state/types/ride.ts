type TBusStop = 'pickupBusstop' | 'dropoffBusstop';
type TLoadingStatus = 'idle' | 'succeeded' | 'failed' | 'pending';
type TLoadingType = string;
type TCurrentrideView = 'orderRide' | 'availableRides';
type TActiveTab = 'pending' | 'completed' | 'cancelled';
type TCounterFareStatus = 'idle' | 'pending' | 'accepted' | 'rejected';
type TCategoryOrigin = 'ajah' | 'lekki' | 'obalende' | 'cms';
type TCategoryDestination = 'lekki' | 'obalende' | 'cms' | 'oshodi';

// interface IRoute {
//     routeName: string;
//     routeDesc: string;
//     routeDistance: string;
// }

// interface IBusStop extends Partial<IRoute> {
//     type: TBusStop;
//     saved?: boolean;
// }

interface IBusStop {
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

interface ISavedBusStop {
    userId: string,
    busstopTitle: string,
    busStop: IBusStop,
}

interface ILoading {
    status: TLoadingStatus;
    type: TLoadingType;
}

interface ITicket {
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

interface IDriverDetails {
    // vehiccle info
    // driver info
}

interface IStateInput {
    pickupBusstopInput: string,
    dropoffBusstopInput: string,
    userCounterFareInput: number | null,
    driverRatingInput: number | null,
    driverRatingCommentInput: string,
    cancelRideReasonInput: string,
}

interface IRide {
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

interface IRideState {
    loading: ILoading,
    searchMatchBusstops: IBusStop[] | [],
    currentRideView: TCurrentrideView,
    userRide: IRide | null,
    availableRides: IRide[] | [],
    currentNumberOfTickets: number,
    activeTab: TActiveTab
    stateInput: IStateInput,
    currentTicket: ITicket | null,
    counterFareStatus: TCounterFareStatus,
    allTicketsFilled: boolean,
}

// Types
export { TBusStop, TLoadingStatus, TCategoryDestination, TCategoryOrigin, TLoadingType, TCurrentrideView, TActiveTab, TCounterFareStatus }

// Interfaces
export type { IBusStop, ILoading, IRide, IRideState, ITicket, IStateInput, ISavedBusStop }