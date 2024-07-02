import { colors } from '@/constants/Colors';
import RBSheet from 'react-native-raw-bottom-sheet';


function BottomSheet({ children, controller, currentHeight }: { children: React.ReactNode, controller: any, currentHeight: number }) {

    return (
        <RBSheet
            // ref={refRBSheet as any}
            ref={controller}
            // useNativeDriver={true}
            draggable
            closeOnPressBack
            height={currentHeight}
            customStyles={{
                wrapper: {
                    backgroundColor: colors.transparent,
                },
                draggableIcon: {
                    backgroundColor: '#D7D7D7',
                    width: 140,
                    // height: 4,
                    borderRadius: 100,
                    marginTop: 10
                },
            }}
            customModalProps={{
                animationType: 'slide',
                statusBarTranslucent: true,
            }}
            customAvoidingViewProps={{
                enabled: false,
            }}
        >
            {children}
        </RBSheet>
    )
}

export default BottomSheet;