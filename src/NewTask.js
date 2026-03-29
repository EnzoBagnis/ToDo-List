import {
    StyleSheet, View, Text, Modal, TouchableOpacity,
    TextInput, ScrollView
} from 'react-native';
import { useTodo } from './context/TodoContext';
import { useState } from 'react';

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

function DateField({ value, onChange }) {
    const [show, setShow] = useState(false);

    const today = new Date();
    const parsed = value ? new Date(value) : today;
    const [day, setDay] = useState(parsed.getDate());
    const [month, setMonth] = useState(parsed.getMonth());
    const [year, setYear] = useState(parsed.getFullYear());

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const months = MONTHS.map((m, i) => ({ label: m, value: i }));
    const years = Array.from({ length: 10 }, (_, i) => today.getFullYear() - 1 + i);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Choisir une date';
        const d = new Date(dateStr);
        if (isNaN(d)) return dateStr;
        return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const handleOpen = () => {
        const p = value ? new Date(value) : today;
        setDay(p.getDate());
        setMonth(p.getMonth());
        setYear(p.getFullYear());
        setShow(true);
    };

    const handleConfirm = () => {
        const safeDay = Math.min(day, daysInMonth);
        const d = new Date(year, month, safeDay);
        onChange(d.toISOString().split('T')[0]);
        setShow(false);
    };

    return (
        <View>
            <TouchableOpacity style={styles.dateButton} onPress={handleOpen}>
                <Text style={styles.dateButtonText}>{formatDate(value)}</Text>
            </TouchableOpacity>

            <Modal transparent animationType="fade" visible={show} onRequestClose={() => setShow(false)}>
                <TouchableOpacity style={dpStyles.overlay} activeOpacity={1} onPress={() => setShow(false)}>
                    <TouchableOpacity activeOpacity={1} style={dpStyles.box}>
                        <Text style={dpStyles.title}>Choisir une date</Text>
                        <View style={dpStyles.columns}>
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
    col: { flex: 1, alignItems: 'center' },
    colLabel: { color: '#aaa', fontSize: 11, marginBottom: 6 },
    scroll: { height: 150 },
    item: {
        paddingVertical: 8,
        paddingHorizontal: 6,
        borderRadius: 6,
        alignItems: 'center',
    },
    itemActive: { backgroundColor: '#2FF768' },
    itemText: { color: '#ccc', fontSize: 14 },
    itemTextActive: { color: '#121010', fontWeight: 'bold' },
    confirm: {
        backgroundColor: '#2FF768',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 40,
        marginBottom: 10,
    },
    confirmText: { color: '#121010', fontWeight: 'bold', fontSize: 15 },
    cancel: { color: '#aaa', fontSize: 13 },
});


export function PopUp({ visible, onClose }) {
    const { addTask, addFolder } = useTodo();
    const [activeTab, setActiveTab] = useState('task');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [folderColor, setFolderColor] = useState('orange');

    const handleAdd = () => {
        if (!title.trim()) return;

        if (activeTab === 'task') {
            addTask({
                title,
                description,
                date_creation: new Date().toISOString().split('T')[0],
                date_echeance: date,
                etat: 'Nouveau',
            });
        } else {
            addFolder({ title, description, color: folderColor, icon: '' });
        }

        setTitle('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
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
                        <TouchableOpacity
                            onPress={() => setActiveTab('task')}
                            style={[styles.tab, activeTab === 'task' && styles.activeTab]}
                        >
                            <Text style={[styles.tabText, activeTab === 'task' && styles.activeTabText]}>
                                Nouvelle Tâche
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveTab('folder')}
                            style={[styles.tab, activeTab === 'folder' && styles.activeTab]}
                        >
                            <Text style={[styles.tabText, activeTab === 'folder' && styles.activeTabText]}>
                                Nouveau Dossier
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.textPlaceHolder}>
                        <TextInput
                            style={styles.inputText}
                            placeholder={activeTab === 'task' ? 'Titre de la tâche' : 'Nom du dossier'}
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
                            <View>
                                <Text style={styles.fieldLabel}>Date d'échéance :</Text>
                                <DateField value={date} onChange={setDate} />
                            </View>
                        ) : (
                            <View style={styles.colorPicker}>
                                <Text style={{ color: '#aaa', marginRight: 10 }}>Couleur:</Text>
                                {['orange', 'pink', 'green', '#2196F3', '#9C27B0'].map(c => (
                                    <TouchableOpacity
                                        key={c}
                                        onPress={() => setFolderColor(c)}
                                        style={[
                                            styles.colorOption,
                                            { backgroundColor: c },
                                            folderColor === c && styles.selectedColor,
                                        ]}
                                    />
                                ))}
                            </View>
                        )}
                    </View>

                    <TouchableOpacity style={styles.closeButton} onPress={handleAdd}>
                        <Text style={styles.textButton}>Ajouter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.closeButton, styles.cancelButton]} onPress={onClose}>
                        <Text style={[styles.textButton, { color: '#2FF768' }]}>Fermer</Text>
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
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '80%',
        margin: 20,
        backgroundColor: '#332828',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
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
    activeTab: { borderBottomColor: '#2FF768' },
    tabText: { color: '#aaa', fontSize: 16 },
    activeTabText: { color: '#2FF768', fontWeight: 'bold' },
    textPlaceHolder: {
        width: '100%',
        borderColor: '#2FF768',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 15,
    },
    inputText: {
        color: '#2FF768',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        paddingVertical: 5,
    },
    fieldLabel: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 4,
    },
    dateButton: {
        borderWidth: 1,
        borderColor: '#2FF768',
        borderRadius: 6,
        paddingVertical: 7,
        paddingHorizontal: 12,
        marginBottom: 5,
    },
    dateButtonText: {
        color: '#2FF768',
        fontSize: 14,
    },
    closeButton: {
        backgroundColor: '#2FF768',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 30,
        elevation: 2,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#2FF768',
    },
    textButton: {
        color: '#332828',
        fontWeight: 'bold',
        textAlign: 'center',
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
    },
});