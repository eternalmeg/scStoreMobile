import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
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
                            />
                        </View>
                    </View>

                    <View style={styles.registerButton}>
                        <Text style={styles.registerButtonText}>Create an account</Text>
                    </View>

                    <Text style={styles.accountPrompt}>
                        Already have an account?{' '}
                        <Text style={styles.logIn}>Log in</Text>
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
    accountPrompt: { marginTop: 20, fontSize: 14, lineHeight: 22, color: '#666666', textAlign: 'center' },
    logIn: { fontWeight: '600', color: '#946A00' },
});
