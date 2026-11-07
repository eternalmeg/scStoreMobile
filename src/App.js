import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CatalogScreen from './screens/CatalogScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <CatalogScreen />
    </SafeAreaProvider>
  );
}
