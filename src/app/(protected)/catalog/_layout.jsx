import { Stack } from 'expo-router';

export const unstable_settings = { anchor: 'index' };

export default function CatalogLayout() {
    return (
        <Stack id={undefined} screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="[productId]/index" />
            <Stack.Screen name="[productId]/reviews" />
            <Stack.Screen name="[productId]/review-form" />
        </Stack>
    );
}
