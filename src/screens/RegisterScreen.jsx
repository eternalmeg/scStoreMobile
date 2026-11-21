import { useRef, useState } from 'react';
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useAuth } from '../context/useAuth';

export default function RegisterScreen() {
    const { register } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const submitting = useRef(false);

    async function handleRegister() {
        if (submitting.current) {
            return;
        }

        const userData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password,
        };

        if (!userData.firstName) {
            setError('First name is required.');
            return;
        }
        if (userData.firstName.length < 2 || userData.firstName.length > 20) {
            setError('First name must be between 2 and 20 characters.');
            return;
        }
        if (!userData.lastName) {
            setError('Last name is required.');
            return;
        }
        if (userData.lastName.length < 2 || userData.lastName.length > 20) {
            setError('Last name must be between 2 and 20 characters.');
            return;
        }
        if (userData.email.length < 8 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
            setError('Enter a valid email address with at least 8 characters.');
            return;
        }
        if (!userData.phone) {
            setError('Phone is required.');
            return;
        }
        if (userData.phone.length < 9) {
            setError('Phone must contain at least 9 characters.');
            return;
        }
        if (!password.trim()) {
            setError('Password is required.');
            return;
        }
        if (password.length < 4) {
            setError('Password must contain at least 4 characters.');
            return;
        }
        if (!confirmPassword) {
            setError('Please confirm your password.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        submitting.current = true;
        setSubmitting(true);
        setError('');
        Keyboard.dismiss();
        try {
            await register(userData);
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            let message = 'Could not create your account. Please try again.';
            if (error instanceof Error && error.message) {
                message = error.message;
            }
            setError(message);
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
                        <Text style={styles.title} accessibilityRole="header">Create an account</Text>
                    </View>

                    <View style={styles.form}>
                        <View>
                            <Text style={styles.label}>First name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your first name"
                                placeholderTextColor="#999999"
                                autoCapitalize="words"
                                autoComplete="given-name"
                                accessibilityLabel="First name"
                                value={firstName}
                                onChangeText={setFirstName}
                                editable={!isSubmitting}
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Last name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your last name"
                                placeholderTextColor="#999999"
                                autoCapitalize="words"
                                autoComplete="family-name"
                                accessibilityLabel="Last name"
                                value={lastName}
                                onChangeText={setLastName}
                                editable={!isSubmitting}
                            />
                        </View>
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
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Phone</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your phone number"
                                placeholderTextColor="#999999"
                                keyboardType="phone-pad"
                                autoComplete="tel"
                                accessibilityLabel="Phone"
                                value={phone}
                                onChangeText={setPhone}
                                editable={!isSubmitting}
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
                                autoComplete="new-password"
                                accessibilityLabel="Password"
                                value={password}
                                onChangeText={setPassword}
                                editable={!isSubmitting}
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Confirm password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm your password"
                                placeholderTextColor="#999999"
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="new-password"
                                accessibilityLabel="Confirm password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                editable={!isSubmitting}
                                returnKeyType="go"
                                onSubmitEditing={() => { void handleRegister(); }}
                            />
                        </View>
                    </View>

                    {error && <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">{error}</Text>}

                    <Pressable
                        style={[styles.registerButton, isSubmitting && styles.disabledButton]}
                        onPress={() => { void handleRegister(); }}
                        disabled={isSubmitting}
                        accessibilityRole="button"
                        accessibilityLabel="Create an account"
                        accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}
                    >
                        {isSubmitting && <ActivityIndicator color="#FFFFFF" accessibilityLabel="Creating account" />}
                        <Text style={styles.registerButtonText}>Create an account</Text>
                    </Pressable>

                    <Text style={styles.accountPrompt}>
                        Already have an account?{' '}
                        <Link
                            href="/"
                            replace
                            style={styles.logIn}
                            accessibilityState={{ disabled: isSubmitting }}
                            onPress={(event) => {
                                if (submitting.current) {
                                    event.preventDefault();
                                }
                            }}
                        >Log in</Link>
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
    registerButton: {
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
    registerButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
    disabledButton: { opacity: 0.65 },
    error: { marginTop: 16, fontSize: 14, lineHeight: 22, color: '#B42318' },
    accountPrompt: { marginTop: 20, fontSize: 14, lineHeight: 22, color: '#666666', textAlign: 'center' },
    logIn: { fontWeight: '600', color: '#946A00' },
});
