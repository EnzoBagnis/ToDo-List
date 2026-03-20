import {StyleSheet, View, Text, Modal, TouchableOpacity, TextInput} from 'react-native';

export function PopUp({ visible, onClose }) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.inputText}>
                        <TextInput placeholder="Ajouter une tâche" placeholderTextColor="#2FF768" />
                    </View>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={AddTask}
                    >
                        <Text style={styles.textButton}>Ajouter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.textButton}>Fermer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

export function AddTask() {
        // Logique pour ajouter une tâche
    console.log("Tâche ajoutée !");
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Fond semi-transparent
    },
    modalView: {
        width: '80%',
        margin: 20,
        backgroundColor: '#332828', // Même couleur que le footer
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    text: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20,
        color: '#2FF768',
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#2FF768',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10,
    },
    textButton: {
        color: '#332828',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputText: {
        width: '100%',
        height: 40,
        borderColor: '#2FF768',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: '#2FF768',
        marginBottom: 15,
    }
});
