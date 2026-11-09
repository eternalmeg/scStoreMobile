import { useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const user = {
    firstName: 'Alex',
    lastName: 'Morgan',
    phone: '+359 888 123 456',
};

const cartItems = [
    { id: 'lenovo-legion-pro-5', name: 'Lenovo Legion Pro 5', price: 1899, quantity: 1 },
    { id: 'wireless-mouse', name: 'Wireless Mouse', price: 49, quantity: 1 },
];

const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

function formatPrice(price) {
    return `${price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} €`;
}

export default function CheckoutScreen() {
    const [paymentMethod, setPaymentMethod] = useState('cash');

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
                        <Text style={styles.backArrow} accessibilityLabel="Back">‹</Text>
                        <Text style={styles.title} accessibilityRole="header">Checkout</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle} accessibilityRole="header">Delivery details</Text>
                        <View style={styles.form}>
                            <View>
                                <Text style={styles.label}>Full name</Text>
                                <TextInput
                                    style={styles.input}
                                    defaultValue={`${user.firstName} ${user.lastName}`}
                                    placeholder="Enter your full name"
                                    placeholderTextColor="#999999"
                                    autoCapitalize="words"
                                    autoComplete="name"
                                    accessibilityLabel="Full name"
                                />
                            </View>
                            <View>
                                <Text style={styles.label}>Phone</Text>
                                <TextInput
                                    style={styles.input}
                                    defaultValue={user.phone}
                                    placeholder="Enter your phone number"
                                    placeholderTextColor="#999999"
                                    keyboardType="phone-pad"
                                    autoComplete="tel"
                                    accessibilityLabel="Phone"
                                />
                            </View>
                            <View>
                                <Text style={styles.label}>City</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your city"
                                    placeholderTextColor="#999999"
                                    autoCapitalize="words"
                                    accessibilityLabel="City"
                                />
                            </View>
                            <View>
                                <Text style={styles.label}>Delivery address</Text>
                                <TextInput
                                    style={[styles.input, styles.addressInput]}
                                    placeholder="Street, building, apartment"
                                    placeholderTextColor="#999999"
                                    autoCapitalize="sentences"
                                    autoComplete="street-address"
                                    multiline
                                    accessibilityLabel="Delivery address"
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle} accessibilityRole="header">Payment method</Text>
                        <View style={styles.paymentOptions}>
                            <Pressable
                                style={styles.paymentOption}
                                onPress={() => setPaymentMethod('cash')}
                                accessibilityRole="radio"
                                accessibilityState={{ checked: paymentMethod === 'cash' }}
                                accessibilityLabel="Cash on delivery"
                            >
                                <View style={[styles.radioCircle, paymentMethod === 'cash' && styles.selectedRadio]}>
                                    {paymentMethod === 'cash' && <View style={styles.radioDot} />}
                                </View>
                                <Text style={styles.paymentText}>Cash on delivery</Text>
                            </Pressable>
                            <Pressable
                                style={styles.paymentOption}
                                onPress={() => setPaymentMethod('bank')}
                                accessibilityRole="radio"
                                accessibilityState={{ checked: paymentMethod === 'bank' }}
                                accessibilityLabel="Bank transfer (demo)"
                            >
                                <View style={[styles.radioCircle, paymentMethod === 'bank' && styles.selectedRadio]}>
                                    {paymentMethod === 'bank' && <View style={styles.radioDot} />}
                                </View>
                                <Text style={styles.paymentText}>Bank transfer (demo)</Text>
                            </Pressable>
                        </View>
                        {paymentMethod === 'bank' && (
                            <Text style={styles.paymentNotice}>Demo only. No payment will be processed.</Text>
                        )}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle} accessibilityRole="header">Order summary</Text>
                        <View style={styles.summary}>
                            {cartItems.map((item) => (
                                <View key={item.id} style={styles.summaryItem}>
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.productName}>{item.name}</Text>
                                        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
                                    </View>
                                    <Text style={styles.price}>{formatPrice(item.price * item.quantity)}</Text>
                                </View>
                            ))}
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Total:</Text>
                                <Text style={styles.totalValue}>{formatPrice(total)}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.placeOrderButton}>
                        <Text style={styles.placeOrderText}>Place order</Text>
                    </View>
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
    header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 28 },
    backArrow: { fontSize: 32, lineHeight: 36, color: '#333333' },
    title: { fontSize: 20, fontWeight: '700', color: '#222222' },
    section: { marginBottom: 28 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: '#222222', marginBottom: 16 },
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
    addressInput: { minHeight: 88, textAlignVertical: 'top' },
    paymentOptions: { gap: 12 },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderRadius: 14,
        backgroundColor: '#F6F6F6',
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#999999',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRadio: { borderColor: '#946A00' },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#946A00' },
    paymentText: { flex: 1, fontSize: 16, color: '#222222' },
    paymentNotice: { marginTop: 12, fontSize: 14, lineHeight: 20, color: '#666666' },
    summary: { padding: 16, borderRadius: 14, backgroundColor: '#F6F6F6' },
    summaryItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 20 },
    itemInfo: { flex: 1, minWidth: 0 },
    productName: { fontSize: 16, lineHeight: 22, fontWeight: '600', color: '#222222' },
    quantity: { marginTop: 6, fontSize: 14, color: '#666666' },
    price: { fontSize: 16, lineHeight: 22, fontWeight: '700', color: '#946A00' },
    totalRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    totalLabel: { fontSize: 20, fontWeight: '700', color: '#222222' },
    totalValue: { fontSize: 24, fontWeight: '700', color: '#222222' },
    placeOrderButton: {
        minHeight: 52,
        paddingHorizontal: 20,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#222222',
    },
    placeOrderText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
});
