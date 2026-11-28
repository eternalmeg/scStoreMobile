import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as productService from '../services/productService';

export default function CatalogScreen() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let active = true;

        async function loadProducts() {
            try {
                const result = await productService.getAll();
                if (active) {
                    setProducts(result);
                    setError('');
                }
            } catch (err) {
                if (active) {
                    setProducts([]);
                    setError(err.message);
                }
            } finally {
                if (active) {
                    setLoading(false);
                    setRefreshing(false);
                }
            }
        }

        loadProducts();
        return () => { active = false; };
    }, [attempt]);

    function retry() {
        if (loading || refreshing) return;
        setError('');
        setLoading(true);
        setAttempt(attempt + 1);
    }

    function refresh() {
        if (loading || refreshing) return;
        setError('');
        setRefreshing(true);
        setAttempt(attempt + 1);
    }

    const categories = ['All'];
    for (const product of products) {
        if (product.category && !categories.includes(product.category)) {
            categories.push(product.category);
        }
    }
    if (!categories.includes(activeCategory)) {
        categories.push(activeCategory);
    }

    const query = search.trim().toLowerCase();
    const filteredProducts = products.filter(product => {
        if (activeCategory !== 'All' && product.category !== activeCategory) return false;
        const text = [product.brand, product.model, product.category, product.shortDescription, product.description].join(' ').toLowerCase();
        return text.includes(query);
    });

    return (
        <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
            <ScrollView
                style={styles.screen}
                contentContainerStyle={styles.content}
                contentInsetAdjustmentBehavior="never"
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={['#946A00']} tintColor="#946A00" />}
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
                    <View style={styles.headerActions}>
                        <Link href="/profile" style={styles.profileLink}>Profile</Link>
                        <Link href="/cart" asChild>
                            <Pressable
                                style={styles.cartIcon}
                                hitSlop={12}
                                accessibilityRole="button"
                                accessibilityLabel="Shopping cart"
                            >
                                <View style={styles.cartHandle} />
                                <View style={styles.cartStem} />
                                <View style={styles.cartBasket} />
                                <View style={[styles.cartWheel, { left: 8 }]} />
                                <View style={[styles.cartWheel, { left: 18 }]} />
                            </Pressable>
                        </Link>
                    </View>
                </View>

                <View style={styles.search}>
                    <View style={styles.searchIcon} accessible={false}>
                        <View style={styles.searchIconHandle} />
                    </View>
                    <TextInput
                        style={styles.searchText}
                        placeholder="Search products"
                        placeholderTextColor="#777777"
                        accessibilityLabel="Search products"
                        value={search}
                        onChangeText={setSearch}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="search"
                    />
                </View>

                <View style={styles.categories}>
                    {categories.map((category) => (
                        <Pressable
                            key={category}
                            onPress={() => setActiveCategory(category)}
                            accessibilityRole="button"
                            accessibilityState={{ selected: category === activeCategory }}
                            style={[styles.category, category === activeCategory && styles.activeCategory]}
                        >
                            <Text style={[
                                styles.categoryText,
                                category === activeCategory && styles.activeCategoryText,
                            ]}>
                                {category}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {loading && <ActivityIndicator style={styles.status} size="large" color="#946A00" accessibilityLabel="Loading products" />}
                {error ? (
                    <View style={styles.status}>
                        <Text style={styles.message} accessibilityRole="alert">{error}</Text>
                        <Pressable style={styles.retryButton} onPress={retry} disabled={loading || refreshing} accessibilityRole="button">
                            <Text style={styles.retryText}>Try again</Text>
                        </Pressable>
                    </View>
                ) : null}
                {!loading && !error && filteredProducts.length === 0 && (
                    <Text style={[styles.status, styles.message]}>
                        {products.length === 0 ? 'No products available.' : 'No products match your search and category.'}
                    </Text>
                )}
                {!loading && !error && <View style={styles.grid}>
                    {filteredProducts.map((product) => (
                        <Link key={product._id} href={{ pathname: '/catalog/[productId]', params: { productId: product._id } }} asChild>
                            <Pressable style={styles.card} accessibilityRole="button" accessibilityLabel={`View ${product.brand} ${product.model}`}>
                                <View style={styles.imageFrame}>
                                    {product.images?.[0] ? <Image
                                        source={{ uri: product.images[0] }}
                                        style={styles.productImage}
                                        resizeMode="contain"
                                        accessibilityLabel={`${product.brand} ${product.model}`}
                                    /> : <Text style={styles.message}>No image available</Text>}
                                </View>
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName}>{product.brand} {product.model}</Text>
                                    <Text style={styles.price}>{product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</Text>
                                </View>
                            </Pressable>
                        </Link>
                    ))}
                </View>}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 16,
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
    logo: {
        width: (40 * 398) / 258,
        height: 40,
        flexShrink: 0,
    },
    cartIcon: {
        width: 24,
        height: 24,
        flexShrink: 0,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    profileLink: {
        paddingVertical: 12,
        color: '#946A00',
        fontSize: 14,
        fontWeight: '600',
    },
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
    searchText: {
        fontSize: 16,
        color: '#333333',
        flex: 1,
        padding: 0,
    },
    status: {
        paddingVertical: 24,
        gap: 16,
        alignItems: 'center',
    },
    message: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666666',
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#222222',
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 14,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
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
    activeCategory: {
        backgroundColor: '#946A00',
        borderColor: '#946A00',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333333',
    },
    activeCategoryText: {
        color: '#FFFFFF',
    },
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
    productImage: {
        width: '100%',
        height: '100%',
    },
    productInfo: {
        flex: 1,
        paddingTop: 12,
    },
    productName: {
        minHeight: 44,
        marginBottom: 8,
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '600',
        color: '#222222',
    },
    price: {
        marginTop: 'auto',
        fontSize: 16,
        fontWeight: '700',
        color: '#946A00',
    },
});
