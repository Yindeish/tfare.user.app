type TVoidFn = () => void;
type TVoidFnWithVal = <T>(val: T) => void;
type TBottomSheetHeight = 637 | 508 | 490 | 436 | 477 | 444;
type TBottomSheetType = 'recentLocationsSnippet' | 'recentPickupLocations' | 'recentDropoffLocations' | 'routeRideDetails' | 'filledForm' | 'searchingRide';

interface IModal {
    type: string,
    visible: boolean,
    props: any
}

interface IBottomSheet extends IModal {
    height: TBottomSheetHeight,
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
    setBottomSheetHeight: TVoidFnWithVal;
    setBottomSheetType: TVoidFnWithVal;
    setBottomSheetProps: TVoidFnWithVal;
    resetBottomSheetState: TVoidFn;
}

export type { IBottomSheet, ILayoutReducers, ILayoutState, IModal, TVoidFn, TVoidFnWithVal, TBottomSheetHeight, TBottomSheetType }