import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthProvider';
import { useAuth } from '../context/useAuth';

function Navigation() {
    const { user, token, loading, error, retry } = useAuth();
    if (loading || error) {
        return (
            <SafeAreaView style={styles.screen}>
                {loading ? (
                    <>
                        <ActivityIndicator size="large" color="#946A00" accessibilityLabel="Checking session" />
                        <Text style={styles.message}>Checking your session…</Text>
                    </>
                ) : (
                    <>
                        <Text style={styles.title} accessibilityRole="header">Could not check your session</Text>
                        <Text style={styles.message} accessibilityRole="alert">{error}</Text>
                        <Pressable style={styles.button} onPress={() => { void retry(); }} accessibilityRole="button">
                            <Text style={styles.buttonText}>Try again</Text>
                        </Pressable>
                    </>
                )}
            </SafeAreaView>
        );
    }

    const isLoggedIn = Boolean(user && token);
    return (
        <Stack id={undefined} screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }}>
            <Stack.Protected guard={!isLoggedIn} redirectTo="/catalog">
                <Stack.Screen name="index" options={{ title: 'Log in' }} />
                <Stack.Screen name="register" options={{ title: 'Create an account' }} />
            </Stack.Protected>
            <Stack.Protected guard={isLoggedIn} redirectTo="/">
                <Stack.Screen name="(protected)" />
            </Stack.Protected>
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <StatusBar style="dark" />
            <AuthProvider>
                <Navigation />
            </AuthProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#FFFFFF', gap: 16 },
    title: { fontSize: 22, fontWeight: '700', color: '#222222', textAlign: 'center' },
    message: { fontSize: 16, lineHeight: 24, color: '#666666', textAlign: 'center' },
    button: { minHeight: 52, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, backgroundColor: '#222222', justifyContent: 'center' },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
