type TBusStop = 'pickupBusstop' | 'dropoffBusstop';
type TLoadingStatus = 'idle' | 'succeeded' | 'failed';
type TLoadingType = string;

interface IBusStop {
    type: TBusStop;
    routeName: string;
    routeDesc: string;
    routeDistance: string;
}

interface ILoading {
    status: TLoadingStatus;
    type: TLoadingType;
}

interface IRide {
    pickupBusstop: IBusStop,
    dropoffBusstop: IBusStop,
    saved: boolean
}

interface IRideState {
    loading: ILoading,
    pickupBusstopInput: string,
    dropoffBusstopInput: string,
    userProposedAmount: number | string,
}

export type { TBusStop, TLoadingStatus, IBusStop, ILoading, IRide, IRideState, TLoadingType }