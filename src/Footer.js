import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import HouseIcon from '../public/image/house-solid-full.svg';
import PlusIcon from '../public/image/plus-solid-full.svg';
import UserIcon from '../public/image/user-solid-full.svg';
import { PopUp } from './NewTask';

const styles = StyleSheet.create({
    footer: {
        width: '100%',
        height: 60,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute', // Floating footer
        bottom: 20,
    },
    container: {
        flexDirection: 'row',
        backgroundColor: '#332828', // Dark background for the pill
        borderRadius: 30, // Pill shape
        paddingVertical: 10,
        paddingHorizontal: 30,
        justifyContent: 'space-between',
        width: '80%',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        color: '#2FF768', // Green color
        fontWeight: 'bold',
    },
});

export function Footer() {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.footer}>
            <View style={styles.container}>
                <HouseIcon width={30} height={30} fill="#2FF768" />
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <PlusIcon width={30} height={30} fill="#2FF768" />
                </TouchableOpacity>
                <UserIcon width={30} height={30} fill="#2FF768" />
            </View>
            <PopUp visible={modalVisible} onClose={() => setModalVisible(false)} />
        </View>
    );
}
