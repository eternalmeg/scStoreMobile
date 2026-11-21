import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useLocalSearchParams } from 'expo-router';
import { products } from '../data/products';
import { reviews } from '../data/reviews';

const currentUserId = 'alex-morgan';

const stars = [1, 2, 3, 4, 5];

function RatingStars({ rating }) {
    return (
        <View style={styles.stars} accessible accessibilityLabel={`${rating} out of 5 stars`}>
            {stars.map((star) => (
                <Text key={star} style={[styles.star, star > rating && styles.emptyStar]}>
                    {star <= rating ? '★' : '☆'}
                </Text>
            ))}
        </View>
    );
}

export default function ReviewsScreen() {
    const { productId } = useLocalSearchParams();
    const product = products.find(item => item.id === productId);
    if (!product) {
        return (
            <SafeAreaView style={[styles.screen, styles.content]} edges={['top', 'left', 'right']}>
                <Text style={styles.headerTitle}>Product not found</Text>
                <Link href="/catalog" dismissTo style={styles.edit}>Back to Catalog</Link>
            </SafeAreaView>
        );
    }
    const productReviews = reviews.filter(item => item.productId === productId);
    const sortedReviews = [...productReviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    let averageRating = 0;
    if (productReviews.length > 0) {
        averageRating = productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length;
    }
    return (
        <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Link href={{ pathname: '/catalog/[productId]', params: { productId: product.id } }} dismissTo asChild>
                        <Pressable accessibilityRole="button" accessibilityLabel="Back to product" hitSlop={12}>
                            <Text style={styles.backArrow}>←</Text>
                        </Pressable>
                    </Link>
                    <Text style={styles.headerTitle} accessibilityRole="header">Reviews</Text>
                </View>

                <Text style={styles.productName} accessibilityRole="header">
                    {product.name}
                </Text>
                <View style={styles.ratingSummary}>
                    <RatingStars rating={averageRating} />
                    <Text style={styles.averageRating}>{averageRating.toFixed(1)} / 5</Text>
                    <Text style={styles.reviewCount}>{productReviews.length} reviews</Text>
                </View>

                <Link href={{ pathname: '/catalog/[productId]/review-form', params: { productId: product.id } }} asChild>
                    <Pressable style={styles.writeButton} accessibilityRole="button">
                        <Text style={styles.writeButtonText}>Write a review</Text>
                    </Pressable>
                </Link>

                {productReviews.length === 0 && <Text style={styles.comment}>No reviews yet.</Text>}

                <View>
                    {sortedReviews.map((review) => (
                        <View key={review._id} style={styles.reviewRow}>
                            <View style={styles.avatar}>
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
                                <Text style={styles.authorName}>
                                    {review.user.firstName} {review.user.lastName}
                                </Text>
                                <View style={styles.reviewMeta}>
                                    <RatingStars rating={review.rating} />
                                    <Text style={styles.reviewDate}>{review.createdAt}</Text>
                                </View>
                                <Text style={styles.comment}>{review.comment}</Text>
                                {review.imageUrl && (
                                    <View style={styles.reviewImageFrame}>
                                        <Image
                                            source={typeof review.imageUrl === 'string' ? { uri: review.imageUrl } : review.imageUrl}
                                            style={styles.reviewImage}
                                            resizeMode="contain"
                                            accessibilityLabel={`${product.name} review photo`}
                                        />
                                    </View>
                                )}
                                {review.user._id === currentUserId && (
                                    <View style={styles.reviewActions}>
                                        <Link href={{ pathname: '/catalog/[productId]/review-form', params: { productId: product.id, reviewId: review._id } }} style={styles.edit}>Edit</Link>
                                        <Text style={styles.delete}>Delete</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    scroll: { flex: 1 },
    content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 48 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
    backArrow: { fontSize: 28, color: '#333333' },
    headerTitle: { flexShrink: 1, fontSize: 20, fontWeight: '700', color: '#222222' },
    productName: { fontSize: 26, lineHeight: 34, fontWeight: '700', color: '#222222' },
    ratingSummary: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginTop: 10 },
    stars: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    star: { fontSize: 18, color: '#946A00' },
    emptyStar: { color: '#AAAAAA' },
    averageRating: { fontSize: 16, fontWeight: '600', color: '#222222' },
    reviewCount: { fontSize: 14, color: '#777777' },
    writeButton: {
        minHeight: 52,
        paddingHorizontal: 20,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#222222',
        marginTop: 24,
        marginBottom: 20,
    },
    writeButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
    reviewRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0ECE3',
    },
    avatarImage: { width: 44, height: 44, borderRadius: 22 },
    avatarInitials: { fontSize: 14, fontWeight: '700', color: '#333333' },
    reviewContent: { flex: 1, minWidth: 0 },
    authorName: { fontSize: 16, fontWeight: '700', color: '#222222' },
    reviewMeta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 6 },
    reviewDate: { fontSize: 14, color: '#777777' },
    comment: { marginTop: 10, fontSize: 16, lineHeight: 24, color: '#333333' },
    reviewImageFrame: { width: '72%', height: 140, padding: 8, marginTop: 12, borderRadius: 10, backgroundColor: '#F6F6F6' },
    reviewImage: { width: '100%', height: '100%' },
    reviewActions: { flexDirection: 'row', gap: 20, marginTop: 14 },
    edit: { fontSize: 14, fontWeight: '600', color: '#946A00' },
    delete: { fontSize: 14, color: '#666666' },
});
