import React, { createContext, useContext, useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import initialData from '../data/tasks.json';

const TodoContext = createContext();

export const useTodo = () => useContext(TodoContext);

function StartupModal({ visible, onLoadData, onStartFresh }) {
    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View style={styles.overlay}>
                <View style={styles.box}>
                    <Text style={styles.title}>Bienvenue</Text>
                    <Text style={styles.subtitle}>
                        Souhaitez-vous charger les données existantes ou démarrer de zéro ?
                    </Text>
                    <TouchableOpacity style={styles.btnPrimary} onPress={onLoadData}>
                        <Text style={styles.btnPrimaryText}>Charger les données</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSecondary} onPress={onStartFresh}>
                        <Text style={styles.btnSecondaryText}>Démarrer de zéro</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

export const TodoProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [folders, setFolders] = useState([]);
    const [relations, setRelations] = useState([]);
    const [showStartup, setShowStartup] = useState(true);

    const handleLoadData = () => {
        setTasks(initialData.taches || []);
        setFolders(initialData.dossiers || []);
        setRelations(initialData.relations || []);
        setShowStartup(false);
    };

    const handleStartFresh = () => {
        Alert.alert(
            "Repartir de zéro",
            "Toutes les données seront supprimées. Êtes-vous sûr(e) ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Confirmer",
                    style: "destructive",
                    onPress: () => {
                        setTasks([]);
                        setFolders([]);
                        setRelations([]);
                        setShowStartup(false);
                    }
                }
            ]
        );
    };

    const addTask = (newTask) => {
        setTasks(prev => [...prev, { ...newTask, id: Date.now() }]);
    };

    const addFolder = (newFolder) => {
        setFolders(prev => [...prev, { ...newFolder, id: Date.now() }]);
    };

    const updateTask = (updatedTask) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    const updateTaskFolders = (taskId, newFolderIds) => {
        const others = relations.filter(r => r.tache !== taskId);
        const news = newFolderIds.map(fid => ({ tache: taskId, dossier: fid }));
        setRelations([...others, ...news]);
    };

    const addRelation = (taskId, folderId) => {
        setRelations(prev => [...prev, { tache: taskId, dossier: folderId }]);
    };

    const getFoldersForTask = (taskId) => {
        const folderIds = relations.filter(r => r.tache === taskId).map(r => r.dossier);
        return folders.filter(f => folderIds.includes(f.id));
    };

    return (
        <TodoContext.Provider value={{
            tasks, setTasks,
            folders, setFolders,
            relations, setRelations,
            addTask, addFolder,
            updateTask,
            updateTaskFolders,
            addRelation,
            getFoldersForTask,
        }}>
            <StartupModal
                visible={showStartup}
                onLoadData={handleLoadData}
                onStartFresh={handleStartFresh}
            />
            {children}
        </TodoContext.Provider>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        width: '80%',
        backgroundColor: '#332828',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2FF768',
    },
    title: {
        fontSize: 22,
        color: '#2FF768',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        color: '#ccc',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    btnPrimary: {
        backgroundColor: '#2FF768',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 30,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
    },
    btnPrimaryText: {
        color: '#121010',
        fontWeight: 'bold',
        fontSize: 15,
    },
    btnSecondary: {
        borderWidth: 1,
        borderColor: '#2FF768',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 30,
        width: '100%',
        alignItems: 'center',
    },
    btnSecondaryText: {
        color: '#2FF768',
        fontSize: 15,
    },
});