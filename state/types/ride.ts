type TBusStop = 'pickupBusstop' | 'dropoffBusstop';
type TLoadingStatus = 'idle' | 'succeeded' | 'failed';
type TLoadingType = string;
type TCurrentrideView = 'orderRide' | 'availableRides';

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
    currentRideView: TCurrentrideView
}

export type { TBusStop, TLoadingStatus, IBusStop, ILoading, IRide, IRideState, TLoadingType, TCurrentrideView }