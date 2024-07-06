type TBusStop = 'pickupBusstop' | 'dropoffBusstop';
type TLoadingStatus = 'idle' | 'succeeded' | 'failed';
type TLoadingType = string;
type TCurrentrideView = 'orderRide' | 'availableRides';
type TTicketAsTicket1 = Pick<ITicket, 'id'>;

interface IRoute {
    routeName: string;
    routeDesc: string;
    routeDistance: string;
}

interface IBusStop extends Partial<IRoute> {
    type: TBusStop;
}

interface ILoading {
    status: TLoadingStatus;
    type: TLoadingType;
}

interface ITicket {
    id?: string,
    seat: ISeat | null,
    owner?: {}
}

interface IDriverDetails {
    // vehiccle info
    // driver info
}

interface ISeat {
    id?: string,
    no: number,
    available?: boolean,
    selected?: boolean
}

interface IRide {
    id?: string,
    pickupBusstop: IBusStop,
    dropoffBusstop: IBusStop,
    saved: boolean,
    tickets?: ITicket[] | [],
    status: 'idle' | 'canceled' | 'accepted' | 'started',
    userCounterFare?: number | null,
    duration?: string,
    availableSeats?: ISeat[] | [],
    seats?: ISeat[] | [],
    driverDetails?: IDriverDetails,
    busStops?: IBusStop[] | [],
}

interface IRideState {
    loading: ILoading,
    searchMatchBusstops: IBusStop[] | [],
    pickupBusstopInput: string,
    dropoffBusstopInput: string,
    currentRideView: TCurrentrideView,
    addAnotherTicket: boolean,
    userRide: IRide | null,
    userCounterFare: number | null,
    availableRides: IRide[] | [],
    userSelectedSeats: ISeat[] | [],
    ticketAsTicket1: TTicketAsTicket1 | null,
}

export type { TBusStop, TLoadingStatus, IBusStop, ILoading, IRide, IRideState, TLoadingType, TCurrentrideView, TTicketAsTicket1, ISeat, ITicket, IRoute }