import React, { createContext, useContext, useState, useEffect } from 'react';
import initialData from '../data/tasks.json';

const TodoContext = createContext();

export const useTodo = () => useContext(TodoContext);

export const TodoProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [folders, setFolders] = useState([]);
    const [relations, setRelations] = useState([]);

    const loadInitialData = () => {
        setTasks(initialData.taches || []);
        setFolders(initialData.dossiers || []);
        setRelations(initialData.relations || []);
    };

    useEffect(() => {
        loadInitialData();
    }, []);

    const resetData = () => {
        loadInitialData();
    };

    const addTask = (newTask) => {
        setTasks(prev => [...prev, { ...newTask, id: Date.now() }]); // Simple ID generation
    };

    const addFolder = (newFolder) => {
        setFolders(prev => [...prev, { ...newFolder, id: Date.now() }]);
    };

    const updateTask = (updatedTask) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    const updateTaskFolders = (taskId, newFolderIds) => {
        const otherRelations = relations.filter(r => r.tache !== taskId);
        const newRelations = newFolderIds.map(fid => ({ tache: taskId, dossier: fid }));

        setRelations([...otherRelations, ...newRelations]);
    };

    const addRelation = (taskId, folderId) => {
        setRelations(prev => [...prev, { tache: taskId, dossier: folderId }]);
    };

    // Helper to get folders for a task
    const getFoldersForTask = (taskId) => {
        const folderIds = relations.filter(r => r.tache === taskId).map(r => r.dossier);
        return folders.filter(f => folderIds.includes(f.id));
    };

    return (
        <TodoContext.Provider value={{
            tasks, setTasks,
            folders, setFolders,
            relations, setRelations,
            resetData,
            addTask,
            addFolder,
            updateTask,
            updateTaskFolders,
            addRelation,
            getFoldersForTask
        }}>
            {children}
        </TodoContext.Provider>
    );
};
