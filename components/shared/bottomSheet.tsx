import { View, Text, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import { absolute, bg, h, hFull, left0, top0, w, wFull, wHFull } from '@/utils/styles';
import { colors } from '@/constants/Colors';
import { useAppDispatch } from '@/state/hooks/useReduxToolkit';
import { resetBottomSheetState, setBottomSheetSnapPoint } from '@/state/slices/layout';
import LayoutSelectors from '@/state/selectors/layout';
import { indices } from '@/constants/zIndices';


const bottomSheet = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const { bottomSheet } = LayoutSelectors()

    const bottomSheetRef = useRef<BottomSheet>(null);
    const animatedIndex = useSharedValue(0);
    const animatedPosition = useSharedValue(0);
    const snapPoints = useMemo(() => [601, 508, 436, 477, 400, '95%'], []);

    const handleSheetChanges = useCallback((index: number) => {
    }, []);

    useEffect(() => {
        bottomSheetRef.current?.snapToIndex(bottomSheet.snapPoint)
    }, [bottomSheet.snapPoint])

    useEffect(() => {
        if (!bottomSheet.visible) {
            bottomSheetRef.current?.close();
        }
    }, [bottomSheet.visible])

    const { draggableIcon } = StyleSheet.create({
        draggableIcon: {
            backgroundColor: '#D7D7D7',
            width: 140,
            height: 4,
            borderRadius: 100,
            marginTop: 10
        },
    });

    const renderBackdrop = useCallback(
        // (props) => (
        () => (
            <BottomSheetBackdrop
                // {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                animatedIndex={animatedIndex}
                animatedPosition={animatedPosition}
                style={[bg(colors.black), wFull, hFull, absolute, top0, left0]}
                pressBehavior={'close'}
                opacity={0.4}
                onPress={() => dispatch(resetBottomSheetState())}
            />
        ),
        [animatedIndex, animatedPosition, dispatch]
    );

    return (
        <BottomSheet
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            onClose={() => dispatch(setBottomSheetSnapPoint(-1))}
            snapPoints={snapPoints}
            enableHandlePanningGesture
            animateOnMount
            animatedIndex={animatedIndex}
            index={bottomSheet.visible ? 0 : -1}
            backdropComponent={renderBackdrop}
            backgroundStyle={[{ borderRadius: 0, }]}
            enablePanDownToClose
            handleIndicatorStyle={draggableIcon}
        >
            <BottomSheetView>
                {children}
            </BottomSheetView>
        </BottomSheet>
    )
}

export default bottomSheet