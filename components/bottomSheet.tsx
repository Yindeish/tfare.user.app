import { View, Text, StyleSheet } from 'react-native'
import React, { useCallback, useMemo, useRef } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const bottomSheet = ({ children }: { children: React.ReactNode }) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    // const snapPoints = useMemo(() => [], [])
    const snapPoints = ['25%', '50%', '75%', '85%'];

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const { container, contentContainer } = StyleSheet.create({
        container: {
            flex: 1,
            padding: 24,
            backgroundColor: 'grey',
        },
        contentContainer: {
            flex: 1,
            alignItems: 'center',
        },
    });

    return (
        <BottomSheet
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            snapPoints={snapPoints}
            enableHandlePanningGesture
        >
            <BottomSheetView style={contentContainer}>
                {children}
            </BottomSheetView>
        </BottomSheet>
    )
}

export default bottomSheet