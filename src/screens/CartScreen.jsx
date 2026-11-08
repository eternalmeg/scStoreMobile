import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const cartItems = [
    {
        id: 'lenovo-legion-pro-5',
        name: 'Lenovo Legion Pro 5',
        price: 1899,
        quantity: 1,
        image: require('../../assets/images/lenovo-legion-pro-5-16-g10-639672.jpg'),
    },
    {
        id: 'wireless-mouse',
        name: 'Wireless Mouse',
        price: 49,
        quantity: 1,
        image: null,
    },
];

const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

function formatPrice(price) {
    return `${price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} €`;
}

export default function CartScreen() {
    return (
        <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                <Text style={styles.title} accessibilityRole="header">Cart</Text>

                <View style={styles.items}>
                    {cartItems.map((item) => (
                        <View key={item.id} style={styles.item}>
                            <View style={styles.imageFrame}>
                                {item.image ? (
                                    <Image
                                        source={item.image}
                                        style={styles.productImage}
                                        resizeMode="contain"
                                        accessibilityLabel={item.name}
                                    />
                                ) : (
                                    <View style={styles.placeholder}>
                                        <Text style={styles.placeholderText}>No image</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.itemInfo}>
                                <Text style={styles.productName}>{item.name}</Text>
                                <Text style={styles.price}>{formatPrice(item.price)}</Text>
                                <View style={styles.itemControls}>
                                    <View style={styles.quantityControl}>
                                        <View style={styles.quantityStep}>
                                            <Text style={styles.quantitySymbol}>−</Text>
                                        </View>
                                        <Text style={styles.quantity}>{item.quantity}</Text>
                                        <View style={styles.quantityStep}>
                                            <Text style={styles.quantitySymbol}>+</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.remove}>Remove</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.summary}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total:</Text>
                        <Text style={styles.totalValue}>{formatPrice(total)}</Text>
                    </View>
                    <View style={styles.actions}>
                        <View style={styles.checkoutButton}>
                            <Text style={styles.checkoutText}>Proceed to checkout</Text>
                        </View>
                        <View style={styles.continueButton}>
                            <Text style={styles.continueText}>Continue shopping</Text>
                        </View>
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
    items: { gap: 12 },
    item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        padding: 12,
        borderRadius: 14,
        backgroundColor: '#F6F6F6',
    },
    imageFrame: {
        width: 80,
        height: 80,
        flexShrink: 0,
        padding: 6,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
    },
    productImage: { width: '100%', height: '100%' },
    placeholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        backgroundColor: '#EEEEEE',
    },
    placeholderText: { fontSize: 12, color: '#777777', textAlign: 'center' },
    itemInfo: { flex: 1, minWidth: 0 },
    productName: { fontSize: 16, lineHeight: 22, fontWeight: '600', color: '#222222' },
    price: { marginTop: 6, fontSize: 16, fontWeight: '700', color: '#946A00' },
    itemControls: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
        marginTop: 12,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D5D5D5',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
    },
    quantityStep: { width: 30, minHeight: 32, alignItems: 'center', justifyContent: 'center' },
    quantitySymbol: { fontSize: 20, color: '#333333' },
    quantity: { minWidth: 28, textAlign: 'center', fontSize: 14, fontWeight: '600', color: '#222222' },
    remove: { fontSize: 13, color: '#666666', textDecorationLine: 'underline' },
    summary: { marginTop: 24, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#E5E5E5' },
    totalRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
    totalLabel: { fontSize: 20, fontWeight: '700', color: '#222222' },
    totalValue: { fontSize: 24, fontWeight: '700', color: '#222222' },
    actions: { gap: 12, marginTop: 24 },
    checkoutButton: {
        minHeight: 52,
        paddingHorizontal: 20,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#222222',
    },
    checkoutText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
    continueButton: {
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
    continueText: { fontSize: 16, fontWeight: '600', color: '#333333', textAlign: 'center' },
});
