import {StyleSheet, View, Text, Modal, TouchableOpacity, TextInput} from 'react-native';
import { useTodo } from './context/TodoContext';
import { useState } from 'react';

export function PopUp({ visible, onClose }) {
    const { addTask, addFolder } = useTodo();
    const [activeTab, setActiveTab] = useState('task');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [folderColor, setFolderColor] = useState('orange');

    const handleAdd = () => {
        if (!title.trim()) return;

        if (activeTab === 'task') {
            addTask({
                title: title,
                description: description,
                date_creation: new Date().toISOString().split('T')[0],
                date_echeance: date || new Date().toISOString().split('T')[0],
                etat: "Nouveau"
            });
        } else {
            addFolder({
                title: title,
                description: description,
                color: folderColor,
                icon: ''
            });
        }

        setTitle('');
        setDescription('');
        setDate('');
        setFolderColor('orange');
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity onPress={() => setActiveTab('task')} style={[styles.tab, activeTab === 'task' && styles.activeTab]}>
                            <Text style={[styles.tabText, activeTab === 'task' && styles.activeTabText]}>Nouvelle Tâche</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab('folder')} style={[styles.tab, activeTab === 'folder' && styles.activeTab]}>
                            <Text style={[styles.tabText, activeTab === 'folder' && styles.activeTabText]}>Nouveau Dossier</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.textPlaceHolder}>
                        <TextInput
                            style={styles.inputText}
                            placeholder={activeTab === 'task' ? "Titre de la tâche" : "Nom du dossier"}
                            placeholderTextColor="#2FF768"
                            value={title}
                            onChangeText={setTitle}
                        />
                         <TextInput
                            style={styles.inputText}
                            placeholder="Description (Optionnel)"
                            placeholderTextColor="#555"
                            value={description}
                            onChangeText={setDescription}
                        />

                        {activeTab === 'task' ? (
                             <TextInput
                                style={styles.inputText}
                                placeholder="Date échéance (YYYY-MM-DD)"
                                placeholderTextColor="#555"
                                value={date}
                                onChangeText={setDate}
                            />
                        ) : (
                            <View style={styles.colorPicker}>
                                <Text style={{color: '#aaa', marginRight: 10}}>Couleur:</Text>
                                {['orange', 'pink', 'green', '#2196F3', '#9C27B0'].map(c => (
                                    <TouchableOpacity
                                        key={c}
                                        onPress={() => setFolderColor(c)}
                                        style={[styles.colorOption, {backgroundColor: c}, folderColor === c && styles.selectedColor]}
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={handleAdd}
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
        padding: 20,
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
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        width: '100%',
    },
    tab: {
        flex: 1,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#555',
        alignItems: 'center',
    },
    activeTab: {
        borderBottomColor: '#2FF768',
    },
    tabText: {
        color: '#aaa',
        fontSize: 16,
    },
    activeTabText: {
        color: '#2FF768',
        fontWeight: 'bold',
    },
    textPlaceHolder: {
        width: '100%',
        // height: 40, // Removed fixed height to allow content to grow
        borderColor: '#2FF768',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        color: '#2FF768',
        marginBottom: 15,
    },
    inputText: {
        color: '#2FF768',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        paddingVertical: 5,
    },
    colorPicker: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 5,
    },
    colorOption: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8,
    },
    selectedColor: {
        borderWidth: 2,
        borderColor: 'white',
    }
});
