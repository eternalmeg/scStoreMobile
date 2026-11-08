import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const user = {
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex.morgan@example.com',
    phone: '+359 888 123 456',
};

export default function ProfileScreen() {
    return (
        <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                <Text style={styles.title} accessibilityRole="header">Profile</Text>

                <View style={styles.profileSummary}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarInitials}>
                            {user.firstName[0]}{user.lastName[0]}
                        </Text>
                    </View>
                    <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
                </View>

                <View style={styles.details}>
                    <View>
                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.value}>{user.email}</Text>
                    </View>
                    <View style={styles.phoneField}>
                        <Text style={styles.label}>Phone</Text>
                        <Text style={styles.value}>{user.phone}</Text>
                    </View>
                </View>

                <View style={styles.actions}>
                    <View style={styles.editButton}>
                        <Text style={styles.editButtonText}>Edit profile</Text>
                    </View>
                    <View style={styles.logoutButton}>
                        <Text style={styles.logoutButtonText}>Log out</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    scroll: { flex: 1 },
    content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 48 },
    title: { fontSize: 28, fontWeight: '700', color: '#222222', marginBottom: 24 },
    profileSummary: { alignItems: 'center', marginBottom: 28 },
    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0ECE3',
    },
    avatarInitials: { fontSize: 28, fontWeight: '700', color: '#333333' },
    name: { marginTop: 14, fontSize: 24, fontWeight: '700', color: '#222222', textAlign: 'center' },
    details: { padding: 16, borderRadius: 14, backgroundColor: '#F6F6F6' },
    label: { fontSize: 14, fontWeight: '600', color: '#666666', marginBottom: 6 },
    value: { fontSize: 16, lineHeight: 24, color: '#222222' },
    phoneField: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#E5E5E5' },
    actions: { marginTop: 24, gap: 12 },
    editButton: {
        minHeight: 52,
        paddingHorizontal: 20,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#222222',
    },
    editButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
    logoutButton: {
        minHeight: 52,
        paddingHorizontal: 20,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#333333',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
    },
    logoutButtonText: { fontSize: 16, fontWeight: '600', color: '#333333', textAlign: 'center' },
});
