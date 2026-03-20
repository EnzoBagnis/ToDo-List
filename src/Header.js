import { StyleSheet, Text, View } from 'react-native';

/**
 * Header component for the application.
 * Displays a title at the top of the screen.
 *
 * @returns {JSX.Element} The rendered header component.
 */
export function Header() {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>Header</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 60,
        backgroundColor: 'transparent', // Transparent to show gradient
        alignItems: 'center',
        justifyContent: 'center',
        // borderBottomWidth: 1, // Removed border for cleaner look
        // borderBottomColor: '#ddd',
        marginTop: 40,
    },
    title: {
        fontSize: 24, // Slightly larger
        fontWeight: 'bold',
        color: '#2FF768', // Green color specified
    },
});