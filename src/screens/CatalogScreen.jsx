import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const products = [
    {
        id: 'lenovo-legion-pro-5',
        name: 'Lenovo Legion Pro 5',
        image: require('../../assets/images/lenovo-legion-pro-5-16-g10-639672.jpg'),
        price: '1,899.00 €',
    },
    {
        id: 'motorola-razr-50-ultra',
        name: 'Motorola Razr 50 Ultra',
        image: require('../../assets/images/motorola-razr-50-ultra-563033.jpg'),
        price: '799.00 €',
    },
    {
        id: 'msi-katana-15',
        name: 'MSI Katana 15',
        image: require('../../assets/images/msi-katana-15-hx-b14w-664985.jpg'),
        price: '1,299.00 €',
    },
    {
        id: 'msi-meg-vision-x-ai-2',
        name: 'MSI MEG Vision X AI 2',
        image: require('../../assets/images/msi-meg-vision-x-ai-2-685991.jpg'),
        price: '4,499.00 €',
    },
];

const categories = ['All', 'Phones', 'Laptops', 'Desktops'];

export default function CatalogScreen() {
    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.content}
            contentInsetAdjustmentBehavior="automatic"
        >
            <View style={styles.header}>
                <View style={styles.headerBrand}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                        accessibilityLabel="ETM Service logo"
                    />
                    <Text style={styles.title} accessibilityRole="header">SC Store</Text>
                </View>
                <View
                    style={styles.cartIcon}
                    accessible
                    accessibilityRole="image"
                    accessibilityLabel="Shopping cart"
                >
                    <View style={styles.cartHandle} />
                    <View style={styles.cartStem} />
                    <View style={styles.cartBasket} />
                    <View style={[styles.cartWheel, { left: 8 }]} />
                    <View style={[styles.cartWheel, { left: 18 }]} />
                </View>
            </View>

            <View style={styles.search}>
                <View style={styles.searchIcon} accessible={false}>
                    <View style={styles.searchIconHandle} />
                </View>
                <Text style={styles.searchText}>Search products</Text>
            </View>

            <View style={styles.categories}>
                {categories.map((category) => (
                    <View
                        key={category}
                        style={[styles.category, category === 'All' && styles.activeCategory]}
                    >
                        <Text style={[
                            styles.categoryText,
                            category === 'All' && styles.activeCategoryText,
                        ]}>
                            {category}
                        </Text>
                    </View>
                ))}
            </View>

            <View style={styles.grid}>
                {products.map((product) => (
                    <View key={product.id} style={styles.card}>
                        <View style={styles.imageFrame}>
                            <Image
                                source={product.image}
                                style={styles.productImage}
                                resizeMode="contain"
                                accessibilityLabel={product.name}
                            />
                        </View>
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{product.name}</Text>
                            <Text style={styles.price}>{product.price}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    content: {
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 48,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    headerBrand: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flexShrink: 1,
    },
    logo: { width: (40 * 398) / 258, height: 40, flexShrink: 0 },
    cartIcon: { width: 24, height: 24, flexShrink: 0 },
    cartHandle: {
        position: 'absolute',
        top: 1,
        left: 0,
        width: 7,
        height: 2,
        borderRadius: 1,
        backgroundColor: '#333333',
    },
    cartStem: {
        position: 'absolute',
        top: 1,
        left: 6,
        width: 2,
        height: 17,
        borderRadius: 1,
        backgroundColor: '#333333',
        transform: [{ rotate: '-12deg' }],
    },
    cartBasket: {
        position: 'absolute',
        top: 5,
        left: 7,
        width: 16,
        height: 11,
        borderWidth: 2,
        borderColor: '#333333',
        borderRadius: 2,
        transform: [{ skewX: '-10deg' }],
    },
    cartWheel: {
        position: 'absolute',
        top: 20,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#333333',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#222222',
        flexShrink: 1,
    },
    search: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        minHeight: 48,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#D5D5D5',
        borderRadius: 12,
    },
    searchIcon: {
        width: 16,
        height: 16,
        borderWidth: 2,
        borderColor: '#666666',
        borderRadius: 8,
        marginRight: 4,
    },
    searchIconHandle: {
        position: 'absolute',
        width: 8,
        height: 2,
        backgroundColor: '#666666',
        right: -6,
        bottom: -3,
        transform: [{ rotate: '45deg' }],
    },
    searchText: { fontSize: 16, color: '#777777', flexShrink: 1 },
    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginVertical: 20,
    },
    category: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#D5D5D5',
        borderRadius: 24,
    },
    activeCategory: { backgroundColor: '#946A00', borderColor: '#946A00' },
    categoryText: { fontSize: 14, fontWeight: '500', color: '#333333' },
    activeCategoryText: { color: '#FFFFFF' },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 12,
    },
    card: {
        width: '48%',
        padding: 12,
        borderRadius: 14,
        backgroundColor: '#F6F6F6',
    },
    imageFrame: {
        height: 160,
        padding: 8,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
    },
    productImage: { width: '100%', height: '100%' },
    productInfo: { flex: 1, paddingTop: 12 },
    productName: {
        minHeight: 44,
        marginBottom: 8,
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '600',
        color: '#222222',
    },
    price: { marginTop: 'auto', fontSize: 16, fontWeight: '700', color: '#946A00' },
});
