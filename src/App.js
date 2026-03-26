import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Footer } from './Footer';
import { Header } from './Header';
import { TasksScreen } from './Todo';
import { TodoProvider } from './context/TodoContext';

/**
 * Main application component.
 * Renders the full layout with Header, Content, and Footer.
 *
 * @returns {JSX.Element} The active application screen.
 */
export default function App() {
  return (
    <TodoProvider>
      <LinearGradient
        colors={['#121010', '#533F3F', '#191010']}
        locations={[0, 0.62, 1.0]}
        style={styles.container}
      >
          <Header />

          <View style={styles.content}>
            <TasksScreen />
          </View>

          <Footer />
          <StatusBar style="light" />
      </LinearGradient>
    </TodoProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'left',
    justifyContent: 'center',
  },
  text: {
    color: '#2FF768',
    fontSize: 20,
    marginBottom: 10,
  },
});
