import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import PlusIcon from '../public/image/plus-solid-full.svg';
import { PopUp } from './NewTask';

const styles = StyleSheet.create({
    footer: {
        width: '100%',
        height: 60,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
    },
    container: {
        flexDirection: 'row',
        backgroundColor: '#332828',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 30,
        justifyContent: 'space-between',
        width: '20%',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        color: '#2FF768',
        fontWeight: 'bold',
    },
});

export function Footer() {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.footer}>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <PlusIcon width={30} height={30} fill="#2FF768" />
                </TouchableOpacity>
            </View>
            <PopUp visible={modalVisible} onClose={() => setModalVisible(false)} />
        </View>
    );
}
