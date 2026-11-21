import { Stack } from 'expo-router';

export const unstable_settings = { anchor: 'index' };

export default function CartLayout() {
    return (
        <Stack id={undefined} screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="checkout" />
        </Stack>
    );
}
