// BottomSheetContext.tsx
import React, { createContext, useContext, useRef, useState, ReactNode, useCallback } from 'react';
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { View, Text } from 'react-native';
import { bg } from '@/utils/styles';
import { colors } from '@/constants/Colors';

type TBottomSheetType = 'recentLocationsSnippet' | 'recentPickupLocations' | 'recentDropoffLocations' | 'routeRideDetails' | 'filledForm' | 'searchingRides' | 'loadedRides' | 'tripStarted' | 'tripCompleted' | 'cancelRide' | 'ticketDetails' | 'rideBooked';

type BottomSheetContextType = {
    showBottomSheet: (snapPoints: Array<number | string>, content: ReactNode) => void;
    hideBottomSheet: () => void;
    snapPoints: Array<number | string>;
    bottomSheetType: TBottomSheetType;
    setBottomSheetType: (value: TBottomSheetType) => void;
    showBottomSheetWithDismissAction?: (snapPoints: Array<number | string>, content: ReactNode, dismissAction: () => void) => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const BottomSheetProvider = ({ children }: { children: React.ReactNode }) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [snapPoints, setSnapPoints] = useState<Array<number | string>>(['50%']);
    const [bottomSheetType, setBottomSheetType] = useState<TBottomSheetType>('recentLocationsSnippet');
    const [content, setContent] = useState<ReactNode>(<DefaultBottomSheetContent />);
    const [dismissAction, setDismissAction] = useState<(() => void) | undefined>(undefined);

    const showBottomSheet = (snapPoints: Array<number | string>, content: ReactNode) => {
        setSnapPoints(snapPoints);
        setContent(content);
        bottomSheetModalRef.current?.present();
    };

    const hideBottomSheet = () => {
        bottomSheetModalRef.current?.dismiss();
    };

    const showBottomSheetWithDismissAction = (snapPoints: Array<number | string>, content: ReactNode, dismissAction: () => void) => {
        setSnapPoints(snapPoints);
        setContent(content);
        setDismissAction(() => dismissAction);
        bottomSheetModalRef.current?.present();
    };

    const handleClose = useCallback(() => {
        if (dismissAction) {
            dismissAction();
            setDismissAction(undefined); // Reset the dismiss action after it's called
        }
    }, [dismissAction]);


    return (
        <BottomSheetContext.Provider value={{ showBottomSheet, hideBottomSheet, snapPoints, setBottomSheetType, showBottomSheetWithDismissAction, bottomSheetType }}>
            <BottomSheetModalProvider>
                {children}
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    snapPoints={snapPoints}
                    index={0}
                >
                    {content}
                </BottomSheetModal>
            </BottomSheetModalProvider>
        </BottomSheetContext.Provider>
    );
};

export const useBottomSheet = () => {
    const context = useContext(BottomSheetContext);
    if (!context) {
        throw new Error('useBottomSheet must be used within a BottomSheetProvider');
    }
    return context;
};

const DefaultBottomSheetContent = () => {
    return (
        <View style={[bg(colors.transparent), { flex: 1, }]}>

        </View>
    );
};
