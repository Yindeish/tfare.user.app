type TVoidFn = () => void;
type TVoidFnWithVal = <T>(val: T) => void;
// type TBottomSheetHeight = 601 | 508 | 436 | 477 | 400 | number;
type TBottomSheetSnapPoint = number;
type TBottomSheetType = 'recentLocationsSnippet' | 'recentPickupLocations' | 'recentDropoffLocations' | 'routeRideDetails' | 'filledForm' | 'searchingRides' | 'loadedRides' | 'tripStarted' | 'tripCompleted' | 'cancelRide' | 'ticketDetails' | 'rideBooked';

interface IModal {
    type: string,
    visible: boolean,
    props: any
}

interface IBottomSheet extends IModal {
    snapPoint: TBottomSheetSnapPoint,
    type: TBottomSheetType
}

interface ILayoutState {
    modal: IModal,
    bottomSheet: IBottomSheet
}

interface ILayoutReducers {
    // Modal
    openModal: TVoidFn;
    closeModal: TVoidFn;
    toggleModal: TVoidFn;
    setModalType: TVoidFnWithVal;
    setModalProps: TVoidFnWithVal;
    resetModalState: TVoidFn;
    // BottomSheet
    openBottomSheet: TVoidFn;
    closeBottomSheet: TVoidFn;
    toggleBottomSheet: TVoidFn;
    setBottomSheetIndex: TVoidFnWithVal;
    setBottomSheetType: TVoidFnWithVal;
    setBottomSheetProps: TVoidFnWithVal;
    resetBottomSheetState: TVoidFn;
}

export type { IBottomSheet, ILayoutReducers, ILayoutState, IModal, TVoidFn, TVoidFnWithVal, TBottomSheetSnapPoint, TBottomSheetType }