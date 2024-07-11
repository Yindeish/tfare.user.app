import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Button, ViewStyle } from 'react-native';
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
    BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import LayoutSelectors from '@/state/selectors/layout';
import { useSharedValue } from 'react-native-reanimated';
import { absolute, bg, hFull, left0, top0, wFull } from '@/utils/styles';
import { colors } from '@/constants/Colors';
import { useAppDispatch } from '@/state/hooks/useReduxToolkit';
import { closeModal } from '@/state/slices/layout';

type TOnDismiss = () => void;

function bottomSheetModal({ children, onDismiss, initialIdex, bgColor, indicator = true }: { children: React.ReactNode, onDismiss?: TOnDismiss, initialIdex?: number, bgColor?: string, indicator?: boolean }) {
    const dispatch = useAppDispatch()
    const { modal } = LayoutSelectors();

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const animatedIndex = useSharedValue(0);
    const animatedPosition = useSharedValue(0);
    const snapPoints = useMemo(() => [300, 400, '90%'], []);

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
            marginTop: 10,
            display: indicator === false ? 'none' : 'flex'
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
                opacity={0.6}
                onPress={() => dispatch(closeModal())}
            />
        ),
        [animatedIndex, animatedPosition, dispatch]
    );

    return (

        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={initialIdex ? initialIdex : modal.visible ? 0 : -1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            animatedIndex={animatedIndex}
            backdropComponent={renderBackdrop}
            backgroundStyle={[{ borderRadius: 0, }, bg(bgColor || colors.white)]}
            enablePanDownToClose
            handleIndicatorStyle={draggableIcon}
            onDismiss={onDismiss}
        >
            {children}
        </BottomSheetModal>
    )
}

export default bottomSheetModal;