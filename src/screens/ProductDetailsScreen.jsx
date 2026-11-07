import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const product = {
    brand: 'Lenovo',
    model: 'Legion Pro 5',
    price: 1899,
    averageRating: 4,
    description: 'A gaming laptop with a spacious display, a comfortable keyboard and a bold design. Built for games, creative projects and everyday work.',
    image: require('../../assets/images/lenovo-legion-pro-5-16-g10-639672.jpg'),
};

const review = {
    authorName: 'Alex Morgan',
    rating: 5,
    createdAt: '2026-11-07',
    comment: 'Great performance and a comfortable keyboard. Games run smoothly, and the laptop feels solid and well built.',
};

const stars = [1, 2, 3, 4, 5];


const reviewPreviewImage = require('../../assets/images/lenovo-legion-pro-5-16-g10-639672.jpg');

export default function ProductDetailsScreen() {
    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.backArrow} accessibilityLabel="Back">←</Text>
                <Text style={styles.headerTitle} accessibilityRole="header">
                    Product details
                </Text>
            </View>

            <View style={styles.imageFrame}>
                <Image
                    source={product.image}
                    style={styles.productImage}
                    resizeMode="contain"
                    accessibilityLabel={`${product.brand} ${product.model}`}
                />
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
            <Text style={styles.description}>{product.description}</Text>

            <View style={styles.reviews}>
                <View style={styles.reviewsHeader}>
                    <Text style={styles.sectionTitle} accessibilityRole="header">Reviews</Text>
                    <Text style={styles.seeAll}>See all ›</Text>
                </View>

                <View style={styles.reviewRow}>
                    <View style={styles.reviewAvatar}>
                        <Text style={styles.avatarInitials}>AM</Text>
                    </View>
                    <View style={styles.reviewContent}>
                        <Text style={styles.authorName}>{review.authorName}</Text>
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
                        <View style={styles.reviewImageFrame}>
                            <Image
                                source={reviewPreviewImage}
                                style={styles.productImage}
                                resizeMode="contain"
                                accessibilityLabel="Temporary Lenovo Legion Pro 5 review photo"
                            />
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.addToCart}>
                <Text style={styles.addToCartText}>Add to cart</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 40,
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
    imageFrame: {
        height: 280,
        padding: 16,
        borderRadius: 14,
        backgroundColor: '#F6F6F6',
        marginBottom: 20,
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
