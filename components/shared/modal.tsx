import React, { ReactNode } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
    ViewStyle,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface CustomModalProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    animationType?: 'fade' | 'slide' | 'none';
    backdropOpacity?: number;
    showCloseBtn?: boolean;
    style?: ViewStyle,
    closeBtn?: ReactNode
}

const CustomModal: React.FC<CustomModalProps> = ({
    isVisible,
    onClose,
    children,
    title,
    animationType = 'fade',
    backdropOpacity = 0.5,
    showCloseBtn = false,
    style = {},
    closeBtn
}) => {
    return (
        <Modal
            visible={isVisible}
            animationType={animationType}
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={[styles.backdrop, { backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})`, position: 'relative', overflow: 'visible' }]}>
                <Animated.View style={[styles.modalContainer, style ? style : {}]}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    <View style={styles.content}>{children}</View>
                    {/* {showCloseBtn && <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>} */}
                    {closeBtn && closeBtn}
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width,
        height,
    },
    modalContainer: {
        width: width * 0.8,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    content: {
        marginBottom: 16,
        width: '100%',
    },
    closeButton: {
        marginTop: 12,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 8,
    },
    closeText: {
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default CustomModal;