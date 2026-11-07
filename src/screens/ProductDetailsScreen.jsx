import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const product = {
    brand: 'Lenovo',
    model: 'Legion Pro 5',
    price: 1899,
    averageRating: 4,
    shortDescription: 'A powerful laptop with a spacious display and a comfortable keyboard for gaming, creative projects and everyday work.',
    description: `Display: 16-inch display
Refresh rate: 180 Hz

Memory: 32 GB DDR5
Storage: 1 TB SSD
Interfaces: 2 x USB-A, 2 x USB-C (DisplayPort: supported), HDMI 2.1, RJ-45 Ethernet, 3.5 mm headphone/microphone combo jack
Designed for gaming and creative work.`,

    images: [
        require('../../assets/images/lenovo-legion-pro-5-16-g10-639672.jpg'),
        require('../../assets/images/lenovoLegion2.webp'),
        require('../../assets/images/lenovoLegion3.webp'),
    ],
};

const reviewAuthor = {
    firstName: 'Alex',
    lastName: 'Morgan',
    avatarUrl: '',
};

const review = {
    user: reviewAuthor,
    rating: 5,
    createdAt: '2026-11-07',
    comment: 'Great performance and a comfortable keyboard. Games run smoothly, and the laptop feels solid and well built.',
    imageUrl: require('../../assets/images/lenovo-legion-pro-5-16-g10-639672.jpg'),
};

const stars = [1, 2, 3, 4, 5];


export default function ProductDetailsScreen() {
    const [galleryWidth, setGalleryWidth] = useState(0);
    const [activeImage, setActiveImage] = useState(0);
    const descriptionLines = (product.description || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    return (
        <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.backArrow} accessibilityLabel="Back">←</Text>
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
                            key={galleryWidth}
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
                                    setActiveImage(Math.max(0, Math.min(index, product.images.length - 1)));
                                }
                            }}
                        >
                            {galleryWidth > 0 && product.images.map((image, index) => (
                                <View key={index} style={[styles.gallerySlide, { width: galleryWidth }]}>
                                    <Image
                                        source={typeof image === 'string' ? { uri: image } : image}
                                        style={styles.productImage}
                                        resizeMode="contain"
                                        accessibilityLabel={`${product.brand} ${product.model}, image ${index + 1}`}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                    {product.images.length > 1 && (
                        <View
                            style={styles.galleryDots}
                            accessible
                            accessibilityLabel={`Image ${activeImage + 1} of ${product.images.length}`}
                        >
                            {product.images.map((image, index) => (
                                <View key={index} style={[styles.galleryDot, index === activeImage && styles.activeDot]} />
                            ))}
                        </View>
                    )}
                </View>

                <Text style={styles.productName} accessibilityRole="header">
                    {product.brand} {product.model}
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
                        accessibilityLabel={`${product.averageRating} out of 5 stars`}
                    >
                        <View style={styles.stars}>
                            {stars.map((star) => (
                                <Text key={star} style={[styles.star, star > product.averageRating && styles.emptyStar]}>
                                    {star <= product.averageRating ? '★' : '☆'}
                                </Text>
                            ))}
                        </View>
                        <Text style={styles.ratingValue}>({product.averageRating}/5)</Text>
                    </View>
                </View>
                {product.shortDescription?.trim() ? (
                    <Text style={styles.description}>{product.shortDescription.trim()}</Text>
                ) : null}

                <View style={styles.specificationsSection}>
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
                </View>

                <View style={styles.reviews}>
                    <View style={styles.reviewsHeader}>
                        <Text style={styles.sectionTitle} accessibilityRole="header">Reviews</Text>
                        <Text style={styles.seeAll}>See all ›</Text>
                    </View>

                    <View style={styles.reviewRow}>
                        <View style={styles.reviewAvatar}>
                            {review.user.avatarUrl ? (
                                <Image
                                    source={{ uri: review.user.avatarUrl }}
                                    style={styles.avatarImage}
                                    accessibilityLabel={`${review.user.firstName} ${review.user.lastName} avatar`}
                                />
                            ) : (
                                <Text style={styles.avatarInitials}>
                                    {review.user.firstName[0]}{review.user.lastName[0]}
                                </Text>
                            )}
                        </View>
                        <View style={styles.reviewContent}>
                            <Text style={styles.authorName}>{review.user.firstName} {review.user.lastName}</Text>
                            <View style={styles.reviewMeta}>
                                <View
                                    style={styles.stars}
                                    accessible
                                    accessibilityLabel={`${review.rating} out of 5 stars`}
                                >
                                    {stars.map((star) => (
                                        <Text key={star} style={[styles.star, star > review.rating && styles.emptyStar]}>
                                            {star <= review.rating ? '★' : '☆'}
                                        </Text>
                                    ))}
                                </View>
                                <Text style={styles.reviewDate}>{review.createdAt}</Text>
                            </View>
                            <Text style={styles.reviewComment}>
                                {review.comment}
                            </Text>
                            {review.imageUrl && (
                                <View style={styles.reviewImageFrame}>
                                    <Image
                                        source={typeof review.imageUrl === 'string' ? { uri: review.imageUrl } : review.imageUrl}
                                        style={styles.productImage}
                                        resizeMode="contain"
                                        accessibilityLabel="Temporary Lenovo Legion Pro 5 review photo"
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                <View style={styles.addToCart}>
                    <Text style={styles.addToCartText}>Add to cart</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scroll: { flex: 1 },
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
    gallery: { marginBottom: 20 },
    imageFrame: {
        height: 280,
        borderRadius: 14,
        backgroundColor: '#F6F6F6',
        overflow: 'hidden',
    },
    gallerySlide: { height: 280, padding: 16 },
    galleryDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginTop: 12,
    },
    galleryDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#D5D5D5' },
    activeDot: { backgroundColor: '#946A00' },
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
        alignItems: 'center',
        gap: 6,
    },
    stars: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    star: { fontSize: 18, color: '#946A00' },
    emptyStar: { color: '#AAAAAA' },
    ratingValue: { fontSize: 14, color: '#666666' },
    specificationsSection: {
        marginTop: 24,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    specificationsTitle: { marginBottom: 12 },
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
    specificationText: { paddingVertical: 10, fontSize: 14, lineHeight: 22, color: '#555555' },
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
    seeAll: { fontSize: 14, color: '#946A00' },
    reviewRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    reviewAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0ECE3',
    },
    avatarInitials: { fontSize: 14, fontWeight: '700', color: '#333333' },
    avatarImage: { width: 44, height: 44, borderRadius: 22 },
    reviewContent: { flex: 1, minWidth: 0 },
    authorName: { fontSize: 16, fontWeight: '700', color: '#222222' },
    reviewMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 6,
    },
    reviewDate: { fontSize: 14, color: '#777777' },
    reviewComment: {
        marginTop: 10,
        fontSize: 16,
        lineHeight: 24,
        color: '#333333',
    },
    reviewImageFrame: {
        width: '72%',
        height: 140,
        padding: 8,
        marginTop: 12,
        borderRadius: 10,
        backgroundColor: '#F6F6F6',
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
