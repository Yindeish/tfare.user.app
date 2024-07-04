import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
    BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import LayoutSelectors from '@/state/selectors/layout';
import { useSharedValue } from 'react-native-reanimated';
import { bg } from '@/utils/styles';
import { colors } from '@/constants/Colors';
import { useAppDispatch } from '@/state/hooks/useReduxToolkit';
import { closeModal } from '@/state/slices/layout';



function bottomSheetModal({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch()
    const { modal } = LayoutSelectors();

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const animatedIndex = useSharedValue(0);
    const animatedPosition = useSharedValue(0);
    const snapPoints = useMemo(() => [300, 400], []);

    useEffect(() => {
        if (modal.visible) {
            bottomSheetModalRef.current?.present();
            bottomSheetModalRef.current?.snapToIndex(1);
        }
    }, [modal.visible]);

    const handleSheetChanges = useCallback((index: number) => {
    }, []);

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
                style={[bg(colors.transparent)]}
                pressBehavior={'close'}
                opacity={0.4}
                onPress={() => dispatch(closeModal())}
            />
        ),
        [animatedIndex, animatedPosition, dispatch]
    );

    return (

        <BottomSheetModal
            ref={bottomSheetModalRef}
            // index={1}
            index={modal.visible ? 0 : -1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            animatedIndex={animatedIndex}
            backdropComponent={renderBackdrop}
            backgroundStyle={[{ borderRadius: 0, }]}
            enablePanDownToClose
            handleIndicatorStyle={draggableIcon}
        >
            {children}
        </BottomSheetModal>
    )
}

export default bottomSheetModal;