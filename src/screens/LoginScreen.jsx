import { useRef, useState } from 'react';
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useAuth } from '../context/useAuth';

export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const submitting = useRef(false);
    const passwordInput = useRef(null);

    async function handleLogin() {
        if (submitting.current) return;
        if (!email.trim() || !password) {
            setError('Please enter your email and password.');
            return;
        }
        submitting.current = true;
        setSubmitting(true);
        setError('');
        Keyboard.dismiss();
        try {
            await login({ email: email.trim(), password });
            setPassword('');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Could not log in. Please try again.');
        } finally {
            submitting.current = false;
            setSubmitting(false);
        }
    }

    return (
        <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
            <KeyboardAvoidingView style={styles.keyboardArea} behavior="padding">
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                >
                    <View style={styles.header}>
                        <View style={styles.brandBlock}>
                            <Image
                                source={require('../../assets/images/logo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                                accessibilityLabel="ETM Service logo"
                            />
                            <Text style={styles.brandName}>SC Store</Text>
                        </View>
                        <Text style={styles.title} accessibilityRole="header">Log in</Text>
                    </View>

                    <View style={styles.form}>
                        <View>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="you@example.com"
                                placeholderTextColor="#999999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="email"
                                accessibilityLabel="Email"
                                value={email}
                                onChangeText={setEmail}
                                editable={!isSubmitting}
                                returnKeyType="next"
                                onSubmitEditing={() => passwordInput.current?.focus()}
                                submitBehavior="submit"
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor="#999999"
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="current-password"
                                accessibilityLabel="Password"
                                ref={passwordInput}
                                value={password}
                                onChangeText={setPassword}
                                editable={!isSubmitting}
                                returnKeyType="go"
                                onSubmitEditing={() => { void handleLogin(); }}
                            />
                        </View>
                    </View>

                    {error ? <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">{error}</Text> : null}

                    <Pressable
                        style={[styles.loginButton, isSubmitting && styles.disabledButton]}
                        onPress={() => { void handleLogin(); }}
                        disabled={isSubmitting}
                        accessibilityRole="button"
                        accessibilityLabel={isSubmitting ? 'Logging in' : 'Log in'}
                        accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}
                    >
                        {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : null}
                        <Text style={styles.loginButtonText}>{isSubmitting ? 'Logging in…' : 'Log in'}</Text>
                    </Pressable>

                    <Text style={styles.accountPrompt}>
                        Don’t have an account?{' '}
                        {isSubmitting
                            ? <Text style={styles.createAccount}>Create an account</Text>
                            : <Link href="/register" style={styles.createAccount}>Create an account</Link>}
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    keyboardArea: { flex: 1 },
    scroll: { flex: 1 },
    content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 48 },
    header: { alignItems: 'flex-start', marginBottom: 28 },
    brandBlock: { flexDirection: 'row', alignItems: 'center', gap: 12, flexShrink: 1 },
    logo: { width: (40 * 398) / 258, height: 40, flexShrink: 0 },
    brandName: { fontSize: 20, fontWeight: '700', color: '#222222', flexShrink: 1 },
    title: { alignSelf: 'flex-start', marginTop: 24, fontSize: 28, fontWeight: '700', color: '#222222' },
    form: { gap: 16 },
    label: { fontSize: 14, fontWeight: '600', color: '#666666', marginBottom: 6 },
    input: {
        minHeight: 48,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#D5D5D5',
        borderRadius: 10,
        fontSize: 16,
        color: '#222222',
        backgroundColor: '#FFFFFF',
    },
    loginButton: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 24,
        minHeight: 52,
        paddingHorizontal: 20,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#222222',
    },
    loginButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
    disabledButton: { opacity: 0.65 },
    error: { marginTop: 16, fontSize: 14, lineHeight: 22, color: '#B42318' },
    accountPrompt: { marginTop: 20, fontSize: 14, lineHeight: 22, color: '#666666', textAlign: 'center' },
    createAccount: { fontWeight: '600', color: '#946A00' },
});
