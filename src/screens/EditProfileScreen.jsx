import { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';

const user = {
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex.morgan@example.com',
    phone: '+359 888 123 456',
};

export default function EditProfileScreen() {
    const [isPhotoModalVisible, setPhotoModalVisible] = useState(false);
    const closePhotoModal = () => setPhotoModalVisible(false);

    function handleSave() {
        Keyboard.dismiss();
        Alert.alert('Demo profile', 'Profile changes are not saved. This form is using static data.', [
            { text: 'OK', onPress: () => router.dismissTo('/profile') },
        ]);
    }

    return (
        <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
            <KeyboardAvoidingView style={styles.keyboardArea} behavior="padding">
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                >
                    <View style={styles.header}>
                        <Link href="/profile" dismissTo asChild>
                            <Pressable accessibilityRole="button" accessibilityLabel="Back to Profile" hitSlop={12}>
                                <Text style={styles.backArrow}>←</Text>
                            </Pressable>
                        </Link>
                        <Text style={styles.headerTitle} accessibilityRole="header">Edit profile</Text>
                    </View>

                    <View style={styles.photoSection}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarInitials}>
                                {user.firstName[0]}{user.lastName[0]}
                            </Text>
                        </View>
                        <Pressable
                            style={styles.changePhotoButton}
                            accessibilityRole="button"
                            onPress={() => {
                                Keyboard.dismiss();
                                setPhotoModalVisible(true);
                            }}
                        >
                            <Text style={styles.changePhotoText}>Change photo</Text>
                        </Pressable>
                    </View>

                    <View style={styles.form}>
                        <View>
                            <Text style={styles.label}>First name</Text>
                            <TextInput
                                style={styles.input}
                                defaultValue={user.firstName}
                                autoCapitalize="words"
                                autoCorrect={false}
                                accessibilityLabel="First name"
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Last name</Text>
                            <TextInput
                                style={styles.input}
                                defaultValue={user.lastName}
                                autoCapitalize="words"
                                autoCorrect={false}
                                accessibilityLabel="Last name"
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Phone</Text>
                            <TextInput
                                style={styles.input}
                                defaultValue={user.phone}
                                keyboardType="phone-pad"
                                accessibilityLabel="Phone"
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={[styles.input, styles.readOnlyInput]}
                                value={user.email}
                                editable={false}
                                accessibilityLabel="Email, read only"
                            />
                        </View>
                    </View>

                    <Pressable style={styles.saveButton} onPress={handleSave} accessibilityRole="button">
                        <Text style={styles.saveButtonText}>Save changes</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
            <Modal
                visible={isPhotoModalVisible}
                transparent
                animationType="slide"
                onRequestClose={closePhotoModal}
            >
                <View style={styles.modalOverlay}>
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={closePhotoModal}
                        accessibilityRole="button"
                        accessibilityLabel="Dismiss photo options"
                    />
                    <SafeAreaView style={styles.photoPanel} edges={['bottom']} accessibilityViewIsModal>
                        <Text style={styles.photoPanelTitle} accessibilityRole="header">
                            Change profile photo
                        </Text>
                        <Pressable style={styles.photoOption} accessibilityRole="button" disabled>
                            <Text style={styles.photoOptionText}>Take a photo</Text>
                        </Pressable>
                        <Pressable style={styles.photoOption} accessibilityRole="button" disabled>
                            <Text style={styles.photoOptionText}>Choose from gallery</Text>
                        </Pressable>
                        <Pressable style={styles.cancelButton} onPress={closePhotoModal} accessibilityRole="button">
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </Pressable>
                    </SafeAreaView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    keyboardArea: { flex: 1 },
    scroll: { flex: 1 },
    content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 48 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
    backArrow: { fontSize: 28, color: '#333333' },
    headerTitle: { flexShrink: 1, fontSize: 20, fontWeight: '700', color: '#222222' },
    photoSection: { alignItems: 'center', marginBottom: 28 },
    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0ECE3',
    },
    avatarInitials: { fontSize: 28, fontWeight: '700', color: '#333333' },
    changePhotoButton: {
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#D5D5D5',
        borderRadius: 8,
    },
    changePhotoText: { fontSize: 14, fontWeight: '600', color: '#946A00' },
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
    readOnlyInput: { backgroundColor: '#F6F6F6', color: '#666666' },
    saveButton: {
        marginTop: 24,
        minHeight: 52,
        paddingHorizontal: 20,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#222222',
    },
    saveButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.4)' },
    photoPanel: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#FFFFFF',
    },
    photoPanelTitle: { fontSize: 20, fontWeight: '700', color: '#222222', marginBottom: 16 },
    photoOption: {
        minHeight: 52,
        justifyContent: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    photoOptionText: { fontSize: 16, color: '#333333' },
    cancelButton: {
        marginTop: 16,
        minHeight: 52,
        paddingHorizontal: 20,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#333333',
        borderRadius: 12,
    },
    cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#333333' },
});
