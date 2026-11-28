import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useIsFocused, useLocalSearchParams } from 'expo-router';
import * as reviewService from '../services/reviewService';

const stars = [1, 2, 3, 4, 5];


export default function ProductDetailsScreen() {
    const [galleryWidth, setGalleryWidth] = useState(0);
    const [activeImage, setActiveImage] = useState(0);
    const { productId } = useLocalSearchParams();
    const isFocused = useIsFocused();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (!isFocused) return;
        let active = true;

        async function loadProduct() {
            setLoading(true);
            setError('');
            setProduct(null);
            setReviews([]);
            setActiveImage(0);
            try {
                if (typeof productId !== 'string' || !/^[a-f\d]{24}$/i.test(productId)) return;
                const result = await reviewService.getProductReviews(productId);
                if (active) {
                    setProduct(result.product);
                    setReviews(result.reviews);
                }
            } catch (err) {
                if (active && err.status !== 404) setError(err.message);
            } finally {
                if (active) setLoading(false);
            }
        }

        loadProduct();
        return () => { active = false; };
    }, [productId, attempt, isFocused]);

    if (loading || error || !product) {
        let message = 'Product not found';
        if (loading) message = 'Loading product...';
        if (error) message = error;
        return (
            <SafeAreaView style={[styles.screen, styles.content]} edges={['top', 'left', 'right']}>
                {loading && <ActivityIndicator size="large" color="#946A00" />}
                <Text style={styles.statusMessage} accessibilityRole="alert">{message}</Text>
                {error ? <Pressable style={styles.retryButton} onPress={() => setAttempt(attempt + 1)} accessibilityRole="button">
                    <Text style={styles.retryText}>Try again</Text>
                </Pressable> : null}
                <Link href="/catalog" dismissTo style={styles.seeAll}>Back to Catalog</Link>
            </SafeAreaView>
        );
    }
    const name = `${product.brand} ${product.model}`;
    let images = [];
    if (Array.isArray(product.images)) {
        images = product.images.filter(image => typeof image === 'string' && image.trim());
    }
    let averageRating = 0;
    if (reviews.length > 0) {
        averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    }
    const descriptionLines = (product.description || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    return (
        <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Link href="/catalog" dismissTo asChild>
                        <Pressable accessibilityRole="button" accessibilityLabel="Back to Catalog" hitSlop={12}>
                            <Text style={styles.backArrow}>←</Text>
                        </Pressable>
                    </Link>
                    <Text style={styles.headerTitle} accessibilityRole="header">
                        Product details
                    </Text>
                </View>

                <View style={styles.gallery}>
                    <View
                        style={styles.imageFrame}
                        onLayout={(event) => {
                            const width = event.nativeEvent.layout.width;
                            if (width !== galleryWidth) {
                                setGalleryWidth(width);
                                setActiveImage(0);
                            }
                        }}
                    >
                        <ScrollView
                            key={`${product._id}-${galleryWidth}`}
                            horizontal
                            pagingEnabled
                            decelerationRate="fast"
                            disableIntervalMomentum
                            showsHorizontalScrollIndicator={false}
                            scrollEventThrottle={16}
                            onScroll={(event) => {
                                const { contentOffset, layoutMeasurement } = event.nativeEvent;
                                if (layoutMeasurement.width > 0) {
                                    const index = Math.round(contentOffset.x / layoutMeasurement.width);
                                    setActiveImage(Math.max(0, Math.min(index, images.length - 1)));
                                }
                            }}
                        >
                            {images.length === 0 && <View style={[styles.gallerySlide, { width: galleryWidth }]}><Text style={styles.statusMessage}>No image available</Text></View>}
                            {galleryWidth > 0 && images.map((image, index) => (
                                <View key={index} style={[styles.gallerySlide, { width: galleryWidth }]}>
                                    <Image
                                        source={{ uri: image }}
                                        style={styles.productImage}
                                        resizeMode="contain"
                                        accessibilityLabel={`${name}, image ${index + 1}`}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                    {images.length > 1 && (
                        <View
                            style={styles.galleryDots}
                            accessible
                            accessibilityLabel={`Image ${activeImage + 1} of ${images.length}`}
                        >
                            {images.map((image, index) => (
                                <View key={index} style={[styles.galleryDot, index === activeImage && styles.activeDot]} />
                            ))}
                        </View>
                    )}
                </View>

                <Text style={styles.productName} accessibilityRole="header">
                    {name}
                </Text>
                <View style={styles.priceRow}>
                    <Text style={styles.price}>
                        {product.price.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })} €
                    </Text>
                    <View
                        style={styles.ratingGroup}
                        accessible
                        accessibilityLabel={`${averageRating} out of 5 stars`}
                    >
                        <View style={styles.stars}>
                            {stars.map((star) => (
                                <Text key={star} style={[styles.star, star > averageRating && styles.emptyStar]}>
                                    {star <= averageRating ? '★' : '☆'}
                                </Text>
                            ))}
                        </View>
                        <Text style={styles.ratingValue}>({averageRating.toFixed(1)}/5 · {reviews.length} reviews)</Text>
                    </View>
                </View>
                {product.shortDescription?.trim() ? (
                    <Text style={styles.description}>{product.shortDescription.trim()}</Text>
                ) : null}

                {descriptionLines.length > 0 && <View style={styles.specificationsSection}>
                    <Text style={[styles.sectionTitle, styles.specificationsTitle]} accessibilityRole="header">
                        Specifications
                    </Text>
                    {descriptionLines.map((line, index) => {
                        const separator = line.indexOf(':');
                        if (separator === -1) {
                            return <Text key={index} style={styles.specificationText}>{line}</Text>;
                        }

                        return (
                            <View key={index} style={styles.specificationRow}>
                                <Text style={styles.specificationLabel}>{line.slice(0, separator).trim()}</Text>
                                <Text style={styles.specificationValue}>{line.slice(separator + 1).trim()}</Text>
                            </View>
                        );
                    })}
                </View>}

                <View style={styles.reviews}>
                    <View style={styles.reviewsHeader}>
                        <Text style={styles.sectionTitle} accessibilityRole="header">Reviews ({reviews.length})</Text>
                        <Link href={{ pathname: '/catalog/[productId]/reviews', params: { productId: product._id, productName: name } }} style={styles.seeAll}>See all ›</Link>
                    </View>

                    {reviews.length > 0 ? (
                        <View>
                            <Text style={styles.reviewAuthor}>
                                {[reviews[0].user?.firstName, reviews[0].user?.lastName].filter(Boolean).join(' ') || 'Customer'}
                            </Text>
                            <View style={styles.stars} accessible accessibilityLabel={`${reviews[0].rating} out of 5 stars`}>
                                {stars.map(star => (
                                    <Text key={star} style={[styles.star, star > reviews[0].rating && styles.emptyStar]}>
                                        {star <= reviews[0].rating ? '★' : '☆'}
                                    </Text>
                                ))}
                            </View>
                            <Text style={styles.reviewComment}>{reviews[0].comment}</Text>
                            {reviews[0].imageUrl ? (
                                <Image source={{ uri: reviews[0].imageUrl }} style={styles.reviewImage} resizeMode="contain" accessibilityLabel="Review photo" />
                            ) : null}
                        </View>
                    ) : <Text style={styles.reviewComment}>No reviews yet.</Text>}
                </View>

                <Link href="/cart" asChild>
                    <Pressable style={styles.addToCart} accessibilityRole="button">
                        <Text style={styles.addToCartText}>Add to cart</Text>
                    </Pressable>
                </Link>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    reviewImage: {
        width: '72%',
        height: 140,
        marginTop: 12,
        borderRadius: 10,
        backgroundColor: '#F6F6F6',
    },
    statusMessage: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666666',
        marginVertical: 20,
    },
    retryButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#222222',
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 14,
        marginBottom: 20,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    screen: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scroll: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 48,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    backArrow: {
        fontSize: 28,
        color: '#333333',
    },
    headerTitle: {
        flexShrink: 1,
        fontSize: 20,
        fontWeight: '700',
        color: '#222222',
    },
    gallery: {
        marginBottom: 20,
    },
    imageFrame: {
        height: 280,
        borderRadius: 14,
        backgroundColor: '#F6F6F6',
        overflow: 'hidden',
    },
    gallerySlide: {
        height: 280,
        padding: 16,
    },
    galleryDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginTop: 12,
    },
    galleryDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#D5D5D5',
    },
    activeDot: {
        backgroundColor: '#946A00',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productName: {
        fontSize: 26,
        lineHeight: 34,
        fontWeight: '700',
        color: '#222222',
    },
    price: {
        fontSize: 24,
        fontWeight: '700',
        color: '#946A00',
    },
    priceRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 8,
        marginBottom: 14,
    },
    ratingGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 6,
    },
    stars: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    star: {
        fontSize: 18,
        color: '#946A00',
    },
    emptyStar: {
        color: '#AAAAAA',
    },
    ratingValue: {
        fontSize: 14,
        color: '#666666',
    },
    specificationsSection: {
        marginTop: 24,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    specificationsTitle: {
        marginBottom: 12,
    },
    specificationRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    specificationLabel: {
        width: '40%',
        fontSize: 14,
        lineHeight: 22,
        color: '#555555',
    },
    specificationValue: {
        flex: 1,
        minWidth: 0,
        fontSize: 14,
        lineHeight: 22,
        color: '#222222',
    },
    specificationText: {
        paddingVertical: 10,
        fontSize: 14,
        lineHeight: 22,
        color: '#555555',
    },
    reviews: {
        marginTop: 24,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222222',
    },
    reviewsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 16,
    },
    seeAll: {
        fontSize: 14,
        color: '#946A00',
    },
    reviewComment: {
        marginTop: 10,
        fontSize: 16,
        lineHeight: 24,
        color: '#333333',
    },
    reviewAuthor: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222222',
        marginBottom: 6,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555555',
    },
    addToCart: {
        marginTop: 28,
        minHeight: 52,
        paddingHorizontal: 20,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#222222',
    },
    addToCartText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
    },
});
