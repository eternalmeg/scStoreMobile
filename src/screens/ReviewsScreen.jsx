import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useIsFocused, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../context/useAuth';
import * as reviewService from '../services/reviewService';

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
    const { productId, productName } = useLocalSearchParams();
    const isFocused = useIsFocused();
    const { user, token } = useAuth();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [deletingId, setDeletingId] = useState('');
    const [attempt, setAttempt] = useState(0);
    const deletePending = useRef('');
    const operationId = useRef(0);
    const validProductId = typeof productId === 'string' && /^[a-f\d]{24}$/i.test(productId);

    useEffect(() => {
        if (!isFocused) return;
        let active = true;
        operationId.current += 1;
        deletePending.current = '';

        async function loadReviews() {
            setLoading(true);
            setError('');
            setDeleteError('');
            setDeletingId('');
            setProduct(null);
            setReviews([]);
            try {
                if (!validProductId) return;
                const result = await reviewService.getProductReviews(productId);
                if (active) {
                    setProduct(result.product);
                    setReviews(result.reviews);
                }
            } catch (err) {
                if (active) setError(err.message);
            } finally {
                if (active) setLoading(false);
            }
        }

        loadReviews();
        return () => {
            active = false;
            operationId.current += 1;
        };
    }, [productId, validProductId, attempt, isFocused]);

    function confirmDelete(review) {
        if (deletePending.current || !token || !user || (review.user?._id || review.user) !== user._id) return;
        deletePending.current = 'confirm';
        const id = operationId.current;
        setDeletingId(review._id);
        setDeleteError('');
        Alert.alert('Delete review', 'Are you sure you want to delete this review?', [
            {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {
                    if (id !== operationId.current) return;
                    deletePending.current = '';
                    setDeletingId('');
                },
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    if (deletePending.current !== 'confirm' || id !== operationId.current) return;
                    deletePending.current = 'delete';
                    try {
                        await reviewService.deleteReview(review._id, token);
                        if (id === operationId.current) {
                            setReviews(current => current.filter(item => item._id !== review._id));
                            setAttempt(current => current + 1);
                        }
                    } catch (err) {
                        if (id === operationId.current) setDeleteError(err.message);
                    } finally {
                        if (id === operationId.current) {
                            deletePending.current = '';
                            setDeletingId('');
                        }
                    }
                },
            },
        ], { cancelable: false });
    }

    if (!validProductId) {
        return (
            <SafeAreaView style={[styles.screen, styles.content]} edges={['top', 'left', 'right']}>
                <Text style={styles.headerTitle}>Product not found</Text>
                <Link href="/catalog" dismissTo style={styles.edit}>Back to Catalog</Link>
            </SafeAreaView>
        );
    }
    let name = typeof productName === 'string' ? productName : '';
    if (product) name = `${product.brand} ${product.model}`;
    let averageRating = 0;
    if (reviews.length > 0) {
        averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    }
    return (
        <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Link href={{ pathname: '/catalog/[productId]', params: { productId } }} dismissTo asChild>
                        <Pressable accessibilityRole="button" accessibilityLabel="Back to product" hitSlop={12}>
                            <Text style={styles.backArrow}>←</Text>
                        </Pressable>
                    </Link>
                    <Text style={styles.headerTitle} accessibilityRole="header">Reviews</Text>
                </View>

                <Text style={styles.productName} accessibilityRole="header">
                    {name}
                </Text>
                {loading && <ActivityIndicator style={styles.status} size="large" color="#946A00" accessibilityLabel="Loading reviews" />}
                {error ? (
                    <View style={styles.status}>
                        <Text style={styles.error} accessibilityRole="alert">{error}</Text>
                        <Pressable onPress={() => setAttempt(current => current + 1)} accessibilityRole="button" style={styles.retryButton}>
                            <Text style={styles.writeButtonText}>Try again</Text>
                        </Pressable>
                    </View>
                ) : null}
                {!loading && !error && product && <>
                    <View style={styles.ratingSummary}>
                        <RatingStars rating={averageRating} />
                        <Text style={styles.averageRating}>{averageRating.toFixed(1)} / 5</Text>
                        <Text style={styles.reviewCount}>{reviews.length} reviews</Text>
                    </View>

                    <Link href={{ pathname: '/catalog/[productId]/review-form', params: { productId, productName: name } }} asChild>
                        <Pressable style={styles.writeButton} disabled={Boolean(deletingId) || !token} accessibilityRole="button">
                            <Text style={styles.writeButtonText}>Write a review</Text>
                        </Pressable>
                    </Link>

                    {deleteError ? <Text style={styles.error} accessibilityRole="alert">{deleteError} You can try deleting again.</Text> : null}
                    {reviews.length === 0 && <Text style={styles.comment}>No reviews yet. Be the first to write a review.</Text>}

                    <View>
                        {reviews.map((review) => (
                            <View key={review._id} style={styles.reviewRow}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarInitials}>
                                        {review.user?.firstName?.[0] || '?'}{review.user?.lastName?.[0] || ''}
                                    </Text>
                                </View>

                                <View style={styles.reviewContent}>
                                    <Text style={styles.authorName}>
                                        {[review.user?.firstName, review.user?.lastName].filter(Boolean).join(' ') || 'Customer'}
                                    </Text>
                                    <View style={styles.reviewMeta}>
                                        <RatingStars rating={review.rating} />
                                        <Text style={styles.reviewDate}>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</Text>
                                    </View>
                                    <Text style={styles.comment}>{review.comment}</Text>
                                    {user && (review.user?._id || review.user) === user._id && (
                                        <View style={styles.reviewActions}>
                                            <Link href={{ pathname: '/catalog/[productId]/review-form', params: { productId, productName: name, reviewId: review._id } }} asChild>
                                                <Pressable disabled={Boolean(deletingId)} accessibilityRole="button" hitSlop={8}>
                                                    <Text style={styles.edit}>Edit</Text>
                                                </Pressable>
                                            </Link>
                                            <Pressable onPress={() => confirmDelete(review)} disabled={Boolean(deletingId)} accessibilityRole="button" hitSlop={8}>
                                                <Text style={styles.delete}>{deletingId === review._id ? 'Deleting...' : 'Delete'}</Text>
                                            </Pressable>
                                        </View>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                </>}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    status: {
        gap: 16,
        paddingVertical: 24,
    },
    error: {
        fontSize: 14,
        lineHeight: 22,
        color: '#B42318',
    },
    retryButton: {
        alignSelf: 'flex-start',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#222222',
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
    productName: {
        fontSize: 26,
        lineHeight: 34,
        fontWeight: '700',
        color: '#222222',
    },
    ratingSummary: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 10,
        marginTop: 10,
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
    averageRating: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222222',
    },
    reviewCount: {
        fontSize: 14,
        color: '#777777',
    },
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
    writeButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
    },
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
    avatarInitials: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333333',
    },
    reviewContent: {
        flex: 1,
        minWidth: 0,
    },
    authorName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222222',
    },
    reviewMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
        marginTop: 6,
    },
    reviewDate: {
        fontSize: 14,
        color: '#777777',
    },
    comment: {
        marginTop: 10,
        fontSize: 16,
        lineHeight: 24,
        color: '#333333',
    },
    reviewActions: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 14,
    },
    edit: {
        fontSize: 14,
        fontWeight: '600',
        color: '#946A00',
    },
    delete: {
        fontSize: 14,
        color: '#666666',
    },
});
