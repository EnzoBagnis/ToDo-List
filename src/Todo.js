import tasksData from './data/tasks.json';
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity,
    TextInput, Modal, ScrollView
} from 'react-native';
import { useEffect, useMemo, useState, useRef } from "react";
import { useTodo } from './context/TodoContext';

export const ETATS = {
    NOUVEAU: 'Nouveau',
    EN_COURS: 'En cours',
    REUSSI: 'Réussi',
    EN_ATTENTE: 'En attente',
    ABANDONNE: 'Abandonné',
};

export const ETAT_TERMINE = [ETATS.REUSSI, ETATS.ABANDONNE];

const ETAT_ORDER = [
    ETATS.NOUVEAU,
    ETATS.EN_COURS,
    ETATS.EN_ATTENTE,
    ETATS.REUSSI,
    ETATS.ABANDONNE,
];

const formatTitle = (title) => String(title).replace(/^\s*\d+\.\s*/, '').trim();

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const isOverdue = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr) < today;
};

// ---------- DatePicker custom (compatible Expo Go Android/iOS) ----------
const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

function DateField({ value, onChange, style }) {
    const [show, setShow] = useState(false);

    const today = new Date();
    const parsed = value ? new Date(value) : today;
    const [day, setDay] = useState(parsed.getDate());
    const [month, setMonth] = useState(parsed.getMonth()); // 0-indexed
    const [year, setYear] = useState(parsed.getFullYear());

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const months = MONTHS.map((m, i) => ({ label: m, value: i }));
    const years = Array.from({ length: 10 }, (_, i) => today.getFullYear() - 1 + i);

    const handleConfirm = () => {
        const safeDay = Math.min(day, daysInMonth);
        const d = new Date(year, month, safeDay);
        onChange(d.toISOString().split('T')[0]);
        setShow(false);
    };

    const handleOpen = () => {
        const p = value ? new Date(value) : today;
        setDay(p.getDate());
        setMonth(p.getMonth());
        setYear(p.getFullYear());
        setShow(true);
    };

    return (
        <View>
            <TouchableOpacity onPress={handleOpen}>
                <Text style={[style, { textDecorationLine: 'underline' }]}>
                    {value ? formatDate(value) : 'Choisir une date'}
                </Text>
            </TouchableOpacity>

            <Modal transparent animationType="fade" visible={show} onRequestClose={() => setShow(false)}>
                <TouchableOpacity style={dpStyles.overlay} activeOpacity={1} onPress={() => setShow(false)}>
                    <TouchableOpacity activeOpacity={1} style={dpStyles.box}>
                        <Text style={dpStyles.title}>Choisir une date</Text>
                        <View style={dpStyles.columns}>
                            {/* Jours */}
                            <View style={dpStyles.col}>
                                <Text style={dpStyles.colLabel}>Jour</Text>
                                <ScrollView style={dpStyles.scroll} showsVerticalScrollIndicator={false}>
                                    {days.map(d => (
                                        <TouchableOpacity key={d} onPress={() => setDay(d)} style={[dpStyles.item, day === d && dpStyles.itemActive]}>
                                            <Text style={[dpStyles.itemText, day === d && dpStyles.itemTextActive]}>{String(d).padStart(2, '0')}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                            {/* Mois */}
                            <View style={dpStyles.col}>
                                <Text style={dpStyles.colLabel}>Mois</Text>
                                <ScrollView style={dpStyles.scroll} showsVerticalScrollIndicator={false}>
                                    {months.map(m => (
                                        <TouchableOpacity key={m.value} onPress={() => setMonth(m.value)} style={[dpStyles.item, month === m.value && dpStyles.itemActive]}>
                                            <Text style={[dpStyles.itemText, month === m.value && dpStyles.itemTextActive]}>{m.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                            {/* Années */}
                            <View style={dpStyles.col}>
                                <Text style={dpStyles.colLabel}>Année</Text>
                                <ScrollView style={dpStyles.scroll} showsVerticalScrollIndicator={false}>
                                    {years.map(y => (
                                        <TouchableOpacity key={y} onPress={() => setYear(y)} style={[dpStyles.item, year === y && dpStyles.itemActive]}>
                                            <Text style={[dpStyles.itemText, year === y && dpStyles.itemTextActive]}>{y}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                        <TouchableOpacity style={dpStyles.confirm} onPress={handleConfirm}>
                            <Text style={dpStyles.confirmText}>Confirmer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShow(false)}>
                            <Text style={dpStyles.cancel}>Annuler</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const dpStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.65)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        backgroundColor: '#332828',
        borderRadius: 16,
        padding: 20,
        width: '85%',
        borderWidth: 1,
        borderColor: '#2FF768',
        alignItems: 'center',
    },
    title: {
        color: '#2FF768',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 16,
    },
    columns: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    col: {
        flex: 1,
        alignItems: 'center',
    },
    colLabel: {
        color: '#aaa',
        fontSize: 11,
        marginBottom: 6,
    },
    scroll: {
        height: 150,
    },
    item: {
        paddingVertical: 8,
        paddingHorizontal: 6,
        borderRadius: 6,
        alignItems: 'center',
    },
    itemActive: {
        backgroundColor: '#2FF768',
    },
    itemText: {
        color: '#ccc',
        fontSize: 14,
    },
    itemTextActive: {
        color: '#121010',
        fontWeight: 'bold',
    },
    confirm: {
        backgroundColor: '#2FF768',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 40,
        marginBottom: 10,
    },
    confirmText: {
        color: '#121010',
        fontWeight: 'bold',
        fontSize: 15,
    },
    cancel: {
        color: '#aaa',
        fontSize: 13,
    },
});

// ---------- Etat Picker ----------
function EtatPicker({ value, onChange }) {
    const [visible, setVisible] = useState(false);
    return (
        <View>
            <TouchableOpacity onPress={() => setVisible(true)} style={styles.etatBadge}>
                <Text style={styles.etatBadgeText}>{value}</Text>
            </TouchableOpacity>
            <Modal transparent animationType="fade" visible={visible} onRequestClose={() => setVisible(false)}>
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setVisible(false)} activeOpacity={1}>
                    <View style={styles.etatPickerBox}>
                        <Text style={styles.etatPickerTitle}>Changer l'état</Text>
                        {ETAT_ORDER.map(etat => (
                            <TouchableOpacity
                                key={etat}
                                style={[styles.etatOption, value === etat && styles.etatOptionActive]}
                                onPress={() => { onChange(etat); setVisible(false); }}
                            >
                                <Text style={[styles.etatOptionText, value === etat && styles.etatOptionTextActive]}>
                                    {etat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

// ---------- TaskItem ----------
function TaskItem({ task, folders, allFolders, onFolderPress }) {
    const { updateTask, updateTaskFolders } = useTodo();
    const [expanded, setExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({ ...task });
    const [selectedFolderIds, setSelectedFolderIds] = useState([]);

    useEffect(() => { setEditedTask({ ...task }); }, [task]);

    useEffect(() => {
        if (isEditing) setSelectedFolderIds(folders.map(f => f.id));
    }, [isEditing]);

    const handleSave = () => {
        updateTask(editedTask);
        updateTaskFolders(task.id, selectedFolderIds);
        setIsEditing(false);
    };

    const handleChange = (key, value) => setEditedTask(prev => ({ ...prev, [key]: value }));

    const toggleFolderSelection = (folderId) => {
        setSelectedFolderIds(prev =>
            prev.includes(folderId) ? prev.filter(id => id !== folderId) : [...prev, folderId]
        );
    };

    const handleCheck = () => {
        const nextEtat = ETAT_TERMINE.includes(task.etat) ? ETATS.NOUVEAU : ETATS.REUSSI;
        updateTask({ ...task, etat: nextEtat });
    };

    const isDone = ETAT_TERMINE.includes(task.etat);
    const overdue = !isDone && isOverdue(task.date_echeance);

    return (
        <View style={[styles.taskContainer, isDone && styles.taskDone]}>
            <View style={styles.taskHeader}>
                {/* Checkbox */}
                <TouchableOpacity onPress={handleCheck} style={styles.checkbox}>
                    {isDone && <View style={styles.checkboxInner} />}
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                    {isEditing ? (
                        <TextInput
                            style={[styles.taskTitle, styles.input]}
                            value={editedTask.title}
                            onChangeText={(t) => handleChange('title', t)}
                        />
                    ) : (
                        <Text style={[styles.taskTitle, isDone && styles.taskTitleDone]}>
                            {formatTitle(task.title)}
                        </Text>
                    )}

                    {isEditing ? (
                        <View style={{ marginBottom: 4 }}>
                            <Text style={styles.dateLabel}>Échéance :</Text>
                            <DateField
                                value={editedTask.date_echeance}
                                onChange={(d) => handleChange('date_echeance', d)}
                                style={styles.dateText}
                            />
                        </View>
                    ) : (
                        <Text style={[styles.dateText, overdue && styles.dateOverdue]}>
                            Echéance: {formatDate(task.date_echeance)}{overdue ? ' — En retard' : ''}
                        </Text>
                    )}

                    <View style={styles.folderTags}>
                        {folders.slice(0, 2).map(f => (
                            <TouchableOpacity onPress={() => onFolderPress(f.id)} key={f.id}
                                              style={[styles.folderTag, { backgroundColor: f.color || '#555' }]}>
                                <Text style={styles.folderTagText}>{f.title}</Text>
                            </TouchableOpacity>
                        ))}
                        {folders.length > 2 && <Text style={{ color: '#aaa' }}>...</Text>}
                    </View>
                </View>

                <View style={{ alignItems: 'center', gap: 6 }}>
                    {isEditing ? (
                        <EtatPicker value={editedTask.etat} onChange={(e) => handleChange('etat', e)} />
                    ) : (
                        <Text style={styles.etatSmall}>{task.etat}</Text>
                    )}
                    <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.expandButton}>
                        <Text style={styles.expandIcon}>{expanded ? '▲' : '▼'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {expanded && (
                <View style={styles.taskDetails}>
                    {isEditing ? (
                        <TextInput
                            style={[styles.description, styles.input, { textAlignVertical: 'top' }]}
                            value={editedTask.description}
                            onChangeText={(t) => handleChange('description', t)}
                            multiline numberOfLines={3}
                        />
                    ) : (
                        <Text style={styles.description}>{task.description || "Aucune description"}</Text>
                    )}

                    {folders.length > 2 && (
                        <View style={styles.allFolders}>
                            <Text style={{ color: '#fff', marginBottom: 4 }}>Tous les dossiers:</Text>
                            <View style={styles.folderTags}>
                                {folders.map(f => (
                                    <TouchableOpacity onPress={() => onFolderPress(f.id)} key={f.id}
                                                      style={[styles.folderTag, { backgroundColor: f.color || '#555' }]}>
                                        <Text style={styles.folderTagText}>{f.title}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {isEditing && (
                        <View style={styles.folderSelectionContainer}>
                            <Text style={{ color: '#fff', marginBottom: 5, marginTop: 10 }}>Gérer les dossiers:</Text>
                            <View style={styles.folderTags}>
                                {allFolders.map(f => {
                                    const isSelected = selectedFolderIds.includes(f.id);
                                    return (
                                        <TouchableOpacity key={f.id} onPress={() => toggleFolderSelection(f.id)}
                                                          style={[
                                                              styles.folderTag,
                                                              { backgroundColor: f.color || '#555' },
                                                              isSelected ? styles.selectedFolderTag : styles.unselectedFolderTag,
                                                          ]}>
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
                        style={[styles.editButton, isEditing && { backgroundColor: '#2FF768' }]}
                        onPress={isEditing ? handleSave : () => setIsEditing(true)}
                    >
                        <Text style={[styles.editButtonText, isEditing && { color: '#332828', fontWeight: 'bold' }]}>
                            {isEditing ? 'Sauvegarder' : 'Modifier'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

// ---------- FilterBar ----------
function FilterBar({ sort, setSort, filterState, setFilterState, selectedEtats, setSelectedEtats, selectedFolders, setSelectedFolders, folders }) {
    const toggleEtat = (etat) => {
        const n = new Set(selectedEtats);
        n.has(etat) ? n.delete(etat) : n.add(etat);
        setSelectedEtats(n);
    };
    const toggleFolder = (fid) => {
        const n = new Set(selectedFolders);
        n.has(fid) ? n.delete(fid) : n.add(fid);
        setSelectedFolders(n);
    };
    const getFolderName = (id) => folders.find(f => f.id === id)?.title || id;

    return (
        <View style={styles.filterBar}>
            <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Trier:</Text>
                {[['date_echeance', 'Echéance'], ['date_creation', 'Création'], ['title', 'Nom']].map(([key, label]) => (
                    <TouchableOpacity key={key} onPress={() => setSort(key)}>
                        <Text style={[styles.filterOption, sort === key && styles.activeOption]}>{label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Vue:</Text>
                <TouchableOpacity onPress={() => setFilterState('En cours')}>
                    <Text style={[styles.filterOption, filterState === 'En cours' && styles.activeOption]}>En cours</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilterState('Tous')}>
                    <Text style={[styles.filterOption, filterState === 'Tous' && styles.activeOption]}>Tout voir</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>États:</Text>
                {Object.values(ETATS).map(etat => (
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
                            <Text style={styles.selectedFilterText}>{getFolderName(fid)} x</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={() => setSelectedFolders(new Set())}>
                        <Text style={{ color: '#ff6b6b', fontSize: 12, marginLeft: 10 }}>Effacer</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

// ---------- ViewToggle (interrupteur) ----------
function ViewToggle({ viewMode, setViewMode }) {
    return (
        <View style={styles.toggleContainer}>
            <TouchableOpacity
                style={[styles.toggleBtn, styles.toggleLeft, viewMode === 'folders' && styles.toggleActive]}
                onPress={() => setViewMode('folders')}
            >
                <Text style={[styles.toggleText, viewMode === 'folders' && styles.toggleTextActive]}>
                    Dossiers
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.toggleBtn, styles.toggleRight, viewMode === 'tasks' && styles.toggleActive]}
                onPress={() => setViewMode('tasks')}
            >
                <Text style={[styles.toggleText, viewMode === 'tasks' && styles.toggleTextActive]}>
                    Tâches
                </Text>
            </TouchableOpacity>
        </View>
    );
}

// ---------- FolderItem ----------
function FolderItem({ folder, onPress }) {
    return (
        <TouchableOpacity style={styles.folder} onPress={() => onPress(folder)}>
            <Text style={styles.folderText}>{folder.title}</Text>
        </TouchableOpacity>
    );
}

// ---------- TasksScreen ----------
export function TasksScreen() {
    const { tasks, folders, relations, getFoldersForTask } = useTodo();
    const [viewMode, setViewMode] = useState('tasks');
    const [sort, setSort] = useState('date_echeance');
    const [filterState, setFilterState] = useState('En cours');
    const [selectedEtats, setSelectedEtats] = useState(new Set());
    const [selectedFolders, setSelectedFolders] = useState(new Set());
    // null = pas de filtre dossier actif, number = id du dossier filtré depuis vue dossiers
    const [activeFolderFilter, setActiveFolderFilter] = useState(null);

    const processedTasks = useMemo(() => {
        let result = [...tasks];

        if (activeFolderFilter !== null) {
            result = result.filter(t => {
                const tf = getFoldersForTask(t.id);
                return tf.some(f => f.id === activeFolderFilter);
            });
        } else {
            if (selectedEtats.size > 0) {
                result = result.filter(t => selectedEtats.has(t.etat));
            } else if (filterState === 'En cours') {
                result = result.filter(t => !ETAT_TERMINE.includes(t.etat));
            }
            if (selectedFolders.size > 0) {
                result = result.filter(t => {
                    const tf = getFoldersForTask(t.id);
                    return tf.some(f => selectedFolders.has(f.id));
                });
            }
        }

        result.sort((a, b) => {
            if (sort === 'date_echeance') return new Date(a.date_echeance) - new Date(b.date_echeance);
            if (sort === 'date_creation') return new Date(b.date_creation) - new Date(a.date_creation);
            return a.title.localeCompare(b.title);
        });

        return result;
    }, [tasks, sort, filterState, selectedEtats, selectedFolders, relations, activeFolderFilter]);

    const handleFolderPress = (folderId) => {
        const n = new Set(selectedFolders);
        n.has(folderId) ? n.delete(folderId) : n.add(folderId);
        setSelectedFolders(n);
    };

    // Depuis la vue dossiers : on bascule sur tâches filtrées
    const handleFolderCardPress = (folder) => {
        setActiveFolderFilter(folder.id);
        setSelectedEtats(new Set());
        setSelectedFolders(new Set());
        setViewMode('tasks');
    };

    const clearFolderFilter = () => setActiveFolderFilter(null);

    const activeFolder = activeFolderFilter !== null ? folders.find(f => f.id === activeFolderFilter) : null;

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <ViewToggle viewMode={viewMode} setViewMode={(mode) => {
                if (mode === 'tasks') {
                    // On ne remet pas à zéro le filtre dossier si on revient manuellement
                }
                setViewMode(mode);
            }} />

            {viewMode === 'folders' ? (
                <FlatList
                    data={folders}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item }) => (
                        <FolderItem folder={item} onPress={handleFolderCardPress} />
                    )}
                    ListEmptyComponent={<Text style={styles.text}>Aucun dossier</Text>}
                    contentContainerStyle={{ paddingTop: 12, paddingBottom: 80 }}
                />
            ) : (
                <>
                    {activeFolder ? (
                        <View style={styles.activeFolderBanner}>
                            <Text style={styles.activeFolderText}>
                                Dossier : {activeFolder.title}
                            </Text>
                            <TouchableOpacity onPress={clearFolderFilter}>
                                <Text style={styles.activeFolderClear}>Tout afficher</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <FilterBar
                            sort={sort} setSort={setSort}
                            filterState={filterState} setFilterState={setFilterState}
                            selectedEtats={selectedEtats} setSelectedEtats={setSelectedEtats}
                            selectedFolders={selectedFolders} setSelectedFolders={setSelectedFolders}
                            folders={folders}
                        />
                    )}
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
                </>
            )}
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
    toggleContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: '#1a1010',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#2FF768',
        marginBottom: 14,
        overflow: 'hidden',
    },
    toggleBtn: {
        paddingVertical: 7,
        paddingHorizontal: 24,
    },
    toggleLeft: {
        borderRightWidth: 1,
        borderRightColor: '#2FF768',
    },
    toggleRight: {},
    toggleActive: {
        backgroundColor: '#2FF768',
    },
    toggleText: {
        color: '#2FF768',
        fontWeight: 'bold',
        fontSize: 14,
    },
    toggleTextActive: {
        color: '#121010',
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
    activeFolderBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(47, 247, 104, 0.10)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2FF768',
    },
    activeFolderText: {
        color: '#2FF768',
        fontWeight: 'bold',
        fontSize: 14,
    },
    activeFolderClear: {
        color: '#ff6b6b',
        fontSize: 13,
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
    taskDone: {
        borderColor: '#444',
        backgroundColor: 'rgba(255,255,255,0.02)',
        opacity: 0.6,
    },
    taskHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#2FF768',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    checkboxInner: {
        width: 10,
        height: 10,
        borderRadius: 2,
        backgroundColor: '#2FF768',
    },
    taskTitle: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    taskTitleDone: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    dateLabel: {
        color: '#aaa',
        fontSize: 11,
    },
    dateText: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 4,
    },
    dateOverdue: {
        color: '#ff6b6b',
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
    expandButton: { padding: 5 },
    expandIcon: { color: '#2FF768', fontSize: 18 },
    taskDetails: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#444',
        paddingTop: 10,
    },
    description: { color: '#ddd', marginBottom: 10 },
    allFolders: { marginTop: 8 },
    etatSmall: {
        fontSize: 10,
        color: '#aaa',
        textAlign: 'right',
        marginBottom: 2,
    },
    etatBadge: {
        backgroundColor: '#444',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 3,
    },
    etatBadgeText: {
        color: '#2FF768',
        fontSize: 11,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    etatPickerBox: {
        backgroundColor: '#332828',
        borderRadius: 14,
        padding: 20,
        width: '70%',
        borderWidth: 1,
        borderColor: '#2FF768',
    },
    etatPickerTitle: {
        color: '#2FF768',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 14,
        textAlign: 'center',
    },
    etatOption: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 6,
        backgroundColor: '#1a1010',
    },
    etatOptionActive: {
        backgroundColor: '#2FF768',
    },
    etatOptionText: {
        color: '#ccc',
        fontSize: 14,
    },
    etatOptionTextActive: {
        color: '#121010',
        fontWeight: 'bold',
    },
    // Filters
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
    filterLabel: { color: '#aaa', marginRight: 10, fontSize: 12 },
    filterOption: { color: '#2FF768', marginRight: 15, fontSize: 14, opacity: 0.6 },
    activeOption: { fontWeight: 'bold', opacity: 1, textDecorationLine: 'underline' },
    selectedFilterTag: {
        backgroundColor: '#2FF768',
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8,
    },
    selectedFilterText: { color: '#000', fontSize: 12, fontWeight: 'bold' },
    editButton: {
        marginTop: 10,
        alignSelf: 'flex-end',
        backgroundColor: '#444',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    editButtonText: { color: 'white', fontSize: 12 },
    folderSelectionContainer: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#444',
    },
    selectedFolderTag: { borderWidth: 2, borderColor: 'white', opacity: 1 },
    unselectedFolderTag: { opacity: 0.4 },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#2FF768',
        paddingVertical: 2,
        marginBottom: 5,
        color: 'white',
    },
    headerControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
});