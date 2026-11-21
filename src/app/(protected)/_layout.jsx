import { Stack } from 'expo-router';

export const unstable_settings = { anchor: 'catalog' };

export default function ProtectedLayout() {
    return (
        <Stack id={undefined} screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }}>
            <Stack.Screen name="catalog" />
            <Stack.Screen name="profile" />
        </Stack>
    );
}
