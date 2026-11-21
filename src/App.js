import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        initialRouteName="index"
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }}
      >
        <Stack.Screen name="index" options={{ title: 'Log in' }} />
        <Stack.Screen name="register" options={{ title: 'Create an account' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
