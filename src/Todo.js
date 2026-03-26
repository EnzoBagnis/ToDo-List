// javascript
import tasks from './data/tasks.json';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput} from 'react-native';
import {useEffect, useMemo, useState} from "react";
import { useTodo } from './context/TodoContext';

export function useTasks() {
    const [items, setItems] = useState([]);
    useEffect(() => setItems(tasks.taches || []), []);
    return { items, setItems};
}

export function useFolders() {
    const [items, setItems] = useState([]);
    useEffect(() => setItems(tasks.dossiers || []), []);
    return { items, setItems};
}

export function useRelations() {
    const [ items, setItems ] = useState([]);
    useEffect(() => setItems(tasks.relations || []), []);
    return { items , setItems};
}

function useRelationsByFolder(tasks, relations) {
    return useMemo(() => {
        const map = new Map();
        relations.forEach(r => {
            const t = tasks.find(task => task.id === r.tache);
            if (!t) return;
            const fid = r.dossier;
            if (!map.has(fid)) map.set(fid, []);
            map.get(fid).push(t);
        });
        return map;
    }, [tasks, relations]);
}

const formatTitle = (title) => String(title).replace(/^\s*\d+\.\s*/, '').trim();

// javascript
function TaskItem({ task, folders, allFolders, onFolderPress }) {
    const { updateTask, updateTaskFolders } = useTodo();
    const [expanded, setExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({ ...task });
    const [selectedFolderIds, setSelectedFolderIds] = useState([]);

    useEffect(() => {
        setEditedTask({ ...task });
    }, [task]);

    // Initialize selected folders when entering edit mode or when folders prop changes
    useEffect(() => {
        if (isEditing) {
            setSelectedFolderIds(folders.map(f => f.id));
        }
    }, [isEditing, folders]);

    const handleSave = () => {
        updateTask(editedTask);
        updateTaskFolders(task.id, selectedFolderIds);
        setIsEditing(false);
    };

    const handleChange = (key, value) => {
        setEditedTask(prev => ({ ...prev, [key]: value }));
    };

    const toggleFolderSelection = (folderId) => {
        setSelectedFolderIds(prev => {
            if (prev.includes(folderId)) {
                return prev.filter(id => id !== folderId);
            } else {
                return [...prev, folderId];
            }
        });
    };

    return (
        <View style={styles.taskContainer}>
            <View style={styles.taskHeader}>
                <View style={{flex: 1}}>
                    {isEditing ? (
                        <TextInput
                            style={[styles.taskTitle, styles.input]}
                            value={editedTask.title}
                            onChangeText={(text) => handleChange('title', text)}
                        />
                    ) : (
                        <Text style={styles.taskTitle}>{formatTitle(task.title)}</Text>
                    )}

                    {isEditing ? (
                        <TextInput
                             style={[styles.dateText, styles.input]}
                             value={editedTask.date_echeance}
                             onChangeText={(text) => handleChange('date_echeance', text)}
                             placeholder="YYYY-MM-DD"
                        />
                    ) : (
                        <Text style={styles.dateText}>Échéance: {task.date_echeance}</Text>
                    )}

                    <View style={styles.folderTags}>
                        {folders.slice(0, 2).map(f => (
                            <TouchableOpacity onPress={() => onFolderPress(f.id)} key={f.id} style={[styles.folderTag, {backgroundColor: f.color || '#555'}]}>
                                <Text style={styles.folderTagText}>{f.title}</Text>
                            </TouchableOpacity>
                        ))}
                        {folders.length > 2 && <Text style={{color: '#aaa'}}>...</Text>}
                    </View>
                </View>
                <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.expandButton}>
                    <Text style={styles.expandIcon}>{expanded ? '▲' : '▼'}</Text>
                </TouchableOpacity>
            </View>

            {expanded && (
                <View style={styles.taskDetails}>
                    {isEditing ? (
                         <TextInput
                            style={[styles.description, styles.input, {textAlignVertical: 'top'}]}
                            value={editedTask.description}
                            onChangeText={(text) => handleChange('description', text)}
                            multiline
                            numberOfLines={3}
                        />
                    ) : (
                        <Text style={styles.description}>{task.description || "Aucune description"}</Text>
                    )}

                    {folders.length > 2 && (
                         <View style={styles.allFolders}>
                            <Text style={{color: '#fff', marginBottom: 4}}>Tous les dossiers:</Text>
                            <View style={styles.folderTags}>
                                {folders.map(f => (
                                    <TouchableOpacity onPress={() => onFolderPress(f.id)} key={f.id} style={[styles.folderTag, {backgroundColor: f.color || '#555'}]}>
                                        <Text style={styles.folderTagText}>{f.title}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                         </View>
                    )}

                    {isEditing && (
                        <View style={styles.folderSelectionContainer}>
                            <Text style={{color: '#fff', marginBottom: 5, marginTop: 10}}>Gérer les dossiers:</Text>
                            <View style={styles.folderTags}>
                                {allFolders.map(f => {
                                    const isSelected = selectedFolderIds.includes(f.id);
                                    return (
                                        <TouchableOpacity
                                            key={f.id}
                                            onPress={() => toggleFolderSelection(f.id)}
                                            style={[
                                                styles.folderTag,
                                                {backgroundColor: f.color || '#555'},
                                                isSelected ? styles.selectedFolderTag : styles.unselectedFolderTag
                                            ]}
                                        >
                                            <Text style={styles.folderTagText}>
                                                {isSelected ? '✓ ' : ''}{f.title}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.editButton, isEditing && {backgroundColor: '#2FF768'}]}
                        onPress={isEditing ? handleSave : () => setIsEditing(true)}
                    >
                        <Text style={[styles.editButtonText, isEditing && {color: '#332828', fontWeight: 'bold'}]}>
                            {isEditing ? 'Sauvegarder' : 'Modifier'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

function FilterBar({ sort, setSort, filterState, setFilterState, selectedEtats, setSelectedEtats, selectedFolders, setSelectedFolders, folders }) {

    const toggleEtat = (etat) => {
        const newEtats = new Set(selectedEtats);
        if (newEtats.has(etat)) newEtats.delete(etat);
        else newEtats.add(etat);
        setSelectedEtats(newEtats);
    };

    const toggleFolder = (folderId) => {
        const newFolders = new Set(selectedFolders);
        if (newFolders.has(folderId)) newFolders.delete(folderId);
        else newFolders.add(folderId);
        setSelectedFolders(newFolders);
    };

    const getFolderName = (id) => folders.find(f => f.id === id)?.title || id;

    return (
        <View style={styles.filterBar}>
            <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Trier par:</Text>
                <TouchableOpacity onPress={() => setSort('date_echeance')}><Text style={[styles.filterOption, sort==='date_echeance' && styles.activeOption]}>Échéance</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setSort('date_creation')}><Text style={[styles.filterOption, sort==='date_creation' && styles.activeOption]}>Création</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setSort('title')}><Text style={[styles.filterOption, sort==='title' && styles.activeOption]}>Nom</Text></TouchableOpacity>
            </View>
            <View style={styles.filterRow}>
                 <Text style={styles.filterLabel}>Filtre Vue:</Text>
                 <TouchableOpacity onPress={() => setFilterState('En cours')}><Text style={[styles.filterOption, filterState==='En cours' && styles.activeOption]}>En cours</Text></TouchableOpacity>
                 <TouchableOpacity onPress={() => setFilterState('Tous')}><Text style={[styles.filterOption, filterState==='Tous' && styles.activeOption]}>Tout voir</Text></TouchableOpacity>
            </View>
            <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>États:</Text>
                {['Nouveau', 'En attente', 'Réussi', 'Abandonné'].map(etat => (
                    <TouchableOpacity key={etat} onPress={() => toggleEtat(etat)}>
                        <Text style={[styles.filterOption, selectedEtats.has(etat) && styles.activeOption]}>{etat}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {selectedFolders.size > 0 && (
                <View style={styles.filterRow}>
                    <Text style={styles.filterLabel}>Dossiers:</Text>
                    {[...selectedFolders].map(fid => (
                         <TouchableOpacity key={fid} onPress={() => toggleFolder(fid)} style={styles.selectedFilterTag}>
                            <Text style={styles.selectedFilterText}>{getFolderName(fid)} ✕</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={() => setSelectedFolders(new Set())}>
                        <Text style={{color: '#ff6b6b', fontSize: 12, marginLeft: 10}}>Effacer</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

export function TasksScreen() {
    const { tasks, folders, relations, getFoldersForTask, resetData } = useTodo();
    const [viewMode, setViewMode] = useState('tasks');
    const [sort, setSort] = useState('date_echeance');
    const [filterState, setFilterState] = useState('En cours');
    const [selectedEtats, setSelectedEtats] = useState(new Set());
    const [selectedFolders, setSelectedFolders] = useState(new Set());

    const processedTasks = useMemo(() => {
        let result = [...tasks];

        let activeTasks = result;

        if (selectedEtats.size > 0) {
            activeTasks = activeTasks.filter(t => selectedEtats.has(t.etat));
        } else if (filterState === 'En cours') {
            activeTasks = activeTasks.filter(t => t.etat !== 'Réussi' && t.etat !== 'Abandonné');
        }

        if (selectedFolders.size > 0) {
            activeTasks = activeTasks.filter(t => {
                const taskFolders = getFoldersForTask(t.id);
                return taskFolders.some(f => selectedFolders.has(f.id));
            });
        }

        activeTasks.sort((a, b) => {
            if (sort === 'date_echeance') {
                return new Date(b.date_echeance) - new Date(a.date_echeance); // Descending
            } else if (sort === 'date_creation') {
                 return new Date(b.date_creation) - new Date(a.date_creation);
            } else {
                return a.title.localeCompare(b.title);
            }
        });

        return activeTasks;
    }, [tasks, sort, filterState, selectedEtats, selectedFolders, relations]); // Added deps

    const handleReset = () => {
        Alert.alert(
            "Réinitialiser",
            "Êtes-vous sûr(e) de vouloir tout remettre à zéro ?",
            [
                { text: "Annuler", style: "cancel" },
                { text: "Oui", onPress: resetData }
            ]
        );
    };

    const handleFolderPress = (folderId) => {
        const newFolders = new Set(selectedFolders);
        if (newFolders.has(folderId)) newFolders.delete(folderId);
        else newFolders.add(folderId);
        setSelectedFolders(newFolders);
    };

    if (viewMode === 'folders') {
         return (
             <View style={{flex: 1, padding: 16}}>
                 <View style={styles.headerControls}>
                    <TouchableOpacity onPress={() => setViewMode('tasks')} style={styles.modeButton}>
                        <Text style={styles.modeButtonText}>Voir Tâches</Text>
                    </TouchableOpacity>
                 </View>
                 <FlatList
                    data={folders}
                    keyExtractor={item => String(item.id)}
                    renderItem={({item}) => (
                        <View style={styles.folder}>
                            <Text style={styles.folderText}>{item.title}</Text>
                        </View>
                    )}
                 />
             </View>
         )
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <View style={styles.headerControls}>
                <TouchableOpacity onPress={() => setViewMode('folders')} style={styles.modeButton}>
                    <Text style={styles.modeButtonText}>Voir Dossiers</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                     <Text style={styles.resetButtonText}>Reset Data</Text>
                </TouchableOpacity>
            </View>

            <FilterBar
                sort={sort} setSort={setSort}
                filterState={filterState} setFilterState={setFilterState}
                selectedEtats={selectedEtats} setSelectedEtats={setSelectedEtats}
                selectedFolders={selectedFolders} setSelectedFolders={setSelectedFolders}
                folders={folders}
            />

            <FlatList
                data={processedTasks}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <TaskItem
                        task={item}
                        folders={getFoldersForTask(item.id)}
                        allFolders={folders}
                        onFolderPress={handleFolderPress}
                    />
                )}
                ListEmptyComponent={<Text style={styles.text}>Aucune tâche</Text>}
                contentContainerStyle={{ paddingTop: 12, paddingBottom: 80 }}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    text: {
        marginBottom: 6,
        textAlign: 'center',
        fontSize: 16,
        color: '#2FF768',
        fontWeight: '600',
    },
    folder: {
        width: '100%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#2FF768',
        backgroundColor: 'rgba(47, 247, 104, 0.06)',
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
    },
    folderText: {
        marginBottom: 12,
        textAlign: 'center',
        fontSize: 18,
        color: '#2FF768',
        fontWeight: '700',
    },
    taskContainer: {
        width: '100%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#2FF768',
        backgroundColor: 'rgba(47, 247, 104, 0.06)',
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    taskTitle: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    dateText: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 4,
    },
    folderTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
    folderTag: {
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    folderTagText: {
        fontSize: 10,
        color: 'white',
    },
    expandButton: {
        padding: 5,
    },
    expandIcon: {
        color: '#2FF768',
        fontSize: 18,
    },
    taskDetails: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#444',
        paddingTop: 10,
    },
    description: {
        color: '#ddd',
        marginBottom: 10,
    },
    headerControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    modeButton: {
        backgroundColor: '#2FF768',
        padding: 8,
        borderRadius: 5,
    },
    modeButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    resetButton: {
        padding: 8,
    },
    resetButtonText: {
        color: '#ff6b6b',
    },
    filterBar: {
        marginBottom: 15,
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 10,
        borderRadius: 8,
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        flexWrap: 'wrap',
    },
    filterLabel: {
        color: '#aaa',
        marginRight: 10,
        fontSize: 12,
    },
    filterOption: {
        color: '#2FF768',
        marginRight: 15,
        fontSize: 14,
        opacity: 0.6,
    },
    activeOption: {
        fontWeight: 'bold',
        opacity: 1,
        textDecorationLine: 'underline',
    },
    editButton: {
        marginTop: 10,
        alignSelf: 'flex-end',
        backgroundColor: '#444',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    editButtonText: {
        color: 'white',
        fontSize: 12,
    },
    folderSelectionContainer: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#444',
    },
    selectedFolderTag: {
        borderWidth: 2,
        borderColor: 'white',
        opacity: 1,
    },
    unselectedFolderTag: {
        opacity: 0.4,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#2FF768',
        paddingVertical: 2,
        marginBottom: 5,
        color: 'white'
    },
    selectedFilterTag: {
        backgroundColor: '#2FF768',
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8,
    },
    selectedFilterText: {
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold',
    }
});
