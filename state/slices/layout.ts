import { PayloadAction, SliceCaseReducers, ValidateSliceCaseReducers, createSlice } from "@reduxjs/toolkit";
import { ESlicesNames } from "../enums/slicesNames";
import { ILayoutReducers, ILayoutState, TBottomSheetHeight, TBottomSheetType } from "../types/layout";
import { EBottomSheetStatus } from "../enums/layout";

const initialState: ILayoutState = {
    bottomSheet: {
        // height: 637,
        height: 508,
        props: null,
        type: EBottomSheetStatus.recentLocationsSnippet,
        visible: true
    },
    modal: {
        props: {},
        type: '',
        visible: false
    }
}

const layoutSlice = createSlice({
    name: ESlicesNames.layout,
    initialState,
    reducers: {
        // Modal
        closeModal: (state) => {
            state.modal.visible = false;
        },
        setModalType: (state, action: PayloadAction<string>) => {
            state.modal.type = action.payload;
        },
        setModalProps: (state, action: PayloadAction<any>) => {
            state.modal.props = action.payload;
        },
        openModal: (state) => {
            state.modal.visible = true;
        },
        resetModalState: (state) => {
            state.modal.visible = false;
            state.modal.props = null;
            state.modal.type = '';
        },
        // BottomSheet
        openBottomSheet: (state) => {
            state.bottomSheet.visible = true;
        },
        closeBottomSheet: (state) => {
            state.bottomSheet.visible = false;
        },
        setBottomSheetHeight: (state, action: PayloadAction<TBottomSheetHeight>) => {
            state.bottomSheet.height = action.payload;
        },
        setBottomSheetProps: (state, action: PayloadAction<any>) => {
            state.bottomSheet.props = action.payload;
        },
        setBottomSheetType: (state, action: PayloadAction<TBottomSheetType>) => {
            state.bottomSheet.type = action.payload;
        },
        resetBottomSheetState: (state) => {
            state.bottomSheet.visible = false;
            state.bottomSheet.props = null;
            state.bottomSheet.type = 'recentLocationsSnippet';
            state.bottomSheet.height = 637;
        },
    }
})

export const {
    // Modal
    closeBottomSheet,
    setModalProps,
    setModalType,
    openModal,
    resetModalState,
    // BottomSheet
    setBottomSheetType,
    setBottomSheetHeight,
    setBottomSheetProps,
    openBottomSheet,
    resetBottomSheetState,
} = layoutSlice.actions;

export default layoutSlice.reducer;