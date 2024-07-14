type TBusStop = 'pickupBusstop' | 'dropoffBusstop';
type TLoadingStatus = 'idle' | 'succeeded' | 'failed';
type TLoadingType = string;
type TCurrentrideView = 'orderRide' | 'availableRides';
type TTicketAsTicket1 = Pick<ITicket, 'id'>;
type TAddTicketStatus = 'idle' | 'btnVisible' | 'newTicketBlock';
type TActiveTab = 'pending' | 'completed' | 'cancelled';

interface IRoute {
    routeName: string;
    routeDesc: string;
    routeDistance: string;
}

interface IBusStop extends Partial<IRoute> {
    type: TBusStop;
    saved?: boolean;
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
    number: number
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
    userCounterFare?: number | null,
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
    addTicketStatus: TAddTicketStatus,
    userRide: IRide | null,
    availableRides: IRide[] | [],
    ticketAsTicket1: TTicketAsTicket1 | null,
    currentNumberOfTickets: number,
    activeTab: TActiveTab
    stateInput: IStateInput,
    currentTicket: ITicket | null,
}

export type { TBusStop, TLoadingStatus, IBusStop, ILoading, IRide, IRideState, TLoadingType, TCurrentrideView, TTicketAsTicket1, ITicket, IRoute, TAddTicketStatus, TActiveTab, IStateInput }