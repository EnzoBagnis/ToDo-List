// javascript
import tasks from './data/tasks.json';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useEffect, useMemo, useState} from "react";

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
export function TasksScreen() {
    const { items: allTasks } = useTasks();
    const { items: folders } = useFolders();
    const { items: relations } = useRelations();

    const relationsByFolder = useRelationsByFolder(allTasks, relations);

    const referencedTaskIds = useMemo(() => new Set(relations.map(r => r.tache)), [relations]);
    const tasksWithoutFolder = useMemo(
        () => allTasks.filter(t => !referencedTaskIds.has(t.id)),
        [allTasks, referencedTaskIds]
    );

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <FlatList
                data={folders}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => {
                    const tasksForFolder = relationsByFolder.get(item.id) || [];
                    return (
                        <View style={styles.folder}>
                            <Text style={styles.folderText}>{item.title}</Text>
                            {tasksForFolder.length > 0 ? (
                                tasksForFolder.map(t => (
                                    <Text key={String(t.id)} style={styles.text}>
                                        {formatTitle(t.title)}
                                    </Text>
                                ))
                            ) : (
                                <Text style={styles.text}>Aucune tâche</Text>
                            )}
                        </View>
                    );
                }}
                ListEmptyComponent={<Text>Aucun dossier</Text>}
                contentContainerStyle={{ paddingTop: 12, paddingBottom: 32 }}
                // On utilise le Footer pour afficher les tâches sans dossier à la suite
                ListFooterComponent={
                    <View style={styles.folderContainer}>
                        {tasksWithoutFolder.length > 0 ? (
                            tasksWithoutFolder.map(item => (
                                <Text key={String(item.id)} style={styles.text}>
                                    {formatTitle(item.title)}
                                </Text>
                            ))
                        ) : (
                            <Text style={styles.text}>Toutes les tâches sont dans un dossier</Text>
                        )}
                    </View>
                }
            />
        </View>
    );
}


const styles = StyleSheet.create({
    text: {
        marginBottom: 6,
        textAlign: 'left',
        fontSize: 16,
        color: '#2FF768',
        fontWeight: '600',
    },
    folder: {
        width: '90%',
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
    folderContainer: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 12,
    },
});
