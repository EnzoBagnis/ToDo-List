import { StyleSheet, Text, View } from 'react-native';
import { useTodo } from './context/TodoContext';

/**
 * Header component for the application.
 * Displays a title at the top of the screen.
 *
 * @returns {JSX.Element} The rendered header component.
 */
export function Header() {
    const { tasks } = useTodo();
    const total = tasks.length;
    const notFinished = tasks.filter(t => t.etat !== 'Réussi' && t.etat !== 'Abandonné').length;

    return (
        <View style={styles.header}>
            <View style={styles.statsContainer}>
                 <Text style={styles.statsText}>Total: {total}</Text>
                 <Text style={styles.statsText}>À faire: {notFinished}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 60,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 5,
    },
    statsText: {
        color: '#2FF768',
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2FF768',
    },
});