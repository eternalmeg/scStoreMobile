import { Tabs } from 'expo-router/js-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

export const unstable_settings = { anchor: 'catalog' };

export default function ProtectedLayout() {
    return (
        <Tabs
            id={undefined}
            backBehavior="history"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#946A00',
                tabBarInactiveTintColor: '#666666',
                tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#E5E5E5' },
                tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tabs.Screen name="catalog" options={{
                title: 'Catalog',
                popToTopOnBlur: true,
                tabBarAccessibilityLabel: 'Catalog tab',
                tabBarIcon: ({ size, focused }) => (
                    <Ionicons name={focused ? 'grid' : 'grid-outline'} size={size} color={focused ? '#946A00' : '#666666'} />
                ),
            }} />
            <Tabs.Screen name="cart" options={{
                title: 'Cart',
                tabBarAccessibilityLabel: 'Cart tab',
                tabBarIcon: ({ size, focused }) => (
                    <Ionicons name={focused ? 'cart' : 'cart-outline'} size={size} color={focused ? '#946A00' : '#666666'} />
                ),
            }} />
            <Tabs.Screen name="profile" options={{
                title: 'Profile',
                tabBarAccessibilityLabel: 'Profile tab',
                tabBarIcon: ({ size, focused }) => (
                    <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={focused ? '#946A00' : '#666666'} />
                ),
            }} />
        </Tabs>
    );
}
