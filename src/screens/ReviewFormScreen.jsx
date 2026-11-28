import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../context/useAuth';
import * as productService from '../services/productService';
import * as reviewService from '../services/reviewService';

const stars = [1, 2, 3, 4, 5];

export default function ReviewFormScreen() {
    const { productId, productName, reviewId } = useLocalSearchParams();
    const { user, token } = useAuth();
    const userId = user?._id;
    const isEditing = reviewId !== undefined;
    const [product, setProduct] = useState(null);
    const [review, setReview] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const saving = useRef(false);
    const operationId = useRef(0);
    const validProductId = typeof productId === 'string' && /^[a-f\d]{24}$/i.test(productId);

    useEffect(() => {
        let active = true;
        operationId.current += 1;
        saving.current = false;

        async function loadForm() {
            setLoading(true);
            setLoadError('');
            setError('');
            setSubmitting(false);
            setProduct(null);
            setReview(null);
            setRating(0);
            setComment('');
            try {
                if (!validProductId) return;
                if (!token || !userId) throw new Error('Please log in to write a review.');
                if (isEditing && (typeof reviewId !== 'string' || !/^[a-f\d]{24}$/i.test(reviewId))) {
                    throw new Error('Review not found.');
                }
                const [currentProduct, currentReview] = await Promise.all([
                    productService.getOne(productId),
                    isEditing ? reviewService.getOne(reviewId, token) : Promise.resolve(null),
                ]);
                if (currentReview) {
                    const ownerId = currentReview.user?._id || currentReview.user;
                    const deviceId = currentReview.device?._id || currentReview.device;
                    if (ownerId !== userId || deviceId !== productId) {
                        throw new Error('Review not found or you do not have permission to edit it.');
                    }
                    if (!Number.isFinite(currentReview.rating) || currentReview.rating < 1 || currentReview.rating > 5 || typeof currentReview.comment !== 'string') {
                        throw new Error('Unexpected review data. Please try again.');
                    }
                }
                if (active) {
                    setProduct(currentProduct);
                    setReview(currentReview);
                    if (currentReview) {
                        setRating(currentReview.rating);
                        setComment(currentReview.comment);
                    }
                }
            } catch (err) {
                if (active) setLoadError(err.message);
            } finally {
                if (active) setLoading(false);
            }
        }

        loadForm();
        return () => {
            active = false;
            operationId.current += 1;
        };
    }, [productId, reviewId, isEditing, token, userId, validProductId, attempt]);

    if (!validProductId) {
        return (
            <SafeAreaView style={[styles.screen, styles.content]} edges={['top', 'left', 'right']}>
                <Text style={styles.headerTitle}>Product or review not found</Text>
                <Link href="/catalog" dismissTo style={styles.backLink}>Back to Catalog</Link>
            </SafeAreaView>
        );
    }

    let name = typeof productName === 'string' ? productName : '';
    if (product) name = `${product.brand} ${product.model}`;
    const reviewsRoute = { pathname: '/catalog/[productId]/reviews', params: { productId, productName: name } };
    const ready = !loading && !loadError && product?._id === productId && (!isEditing || review?._id === reviewId);

    async function handleSave() {
        if (saving.current || !ready) return;
        Keyboard.dismiss();
        setError('');
        if (typeof rating !== 'number' || !Number.isFinite(rating) || rating < 1 || rating > 5) {
            setError('Choose a rating from 1 to 5 stars.');
            return;
        }
        const text = comment.trim();
        if (text.length < 3) {
            setError('Your review must contain at least 3 characters.');
            return;
        }
        if (!token || !userId) {
            setError('Please log in to write a review.');
            return;
        }
        saving.current = true;
        setSubmitting(true);
        const id = operationId.current;
        try {
            if (isEditing) {
                await reviewService.updateReview(reviewId, { rating, comment: text }, token);
            } else {
                await reviewService.createReview({ productId, rating, comment: text }, token);
            }
            if (id === operationId.current) router.dismissTo(reviewsRoute);
        } catch (err) {
            if (id === operationId.current) {
                setError(err.message);
                saving.current = false;
                setSubmitting(false);
            }
        }
    }

    return (
        <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
            <KeyboardAvoidingView style={styles.keyboardArea} behavior="padding">
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                >
                    <View style={styles.header}>
                        <Link href={reviewsRoute} dismissTo asChild>
                            <Pressable disabled={submitting} accessibilityRole="button" accessibilityLabel="Back to Reviews" hitSlop={12}>
                                <Text style={styles.backArrow}>←</Text>
                            </Pressable>
                        </Link>
                        <Text style={styles.headerTitle} accessibilityRole="header">
                            {isEditing ? 'Edit review' : 'Write a review'}
                        </Text>
                    </View>

                    <Text style={styles.productName}>{name}</Text>

                    {loading && <ActivityIndicator size="large" color="#946A00" accessibilityLabel="Loading review form" />}
                    {loadError ? (
                        <View style={styles.status}>
                            <Text style={styles.error} accessibilityRole="alert">{loadError}</Text>
                            <Pressable style={styles.saveButton} onPress={() => setAttempt(current => current + 1)} accessibilityRole="button">
                                <Text style={styles.saveButtonText}>Try again</Text>
                            </Pressable>
                        </View>
                    ) : null}
                    {ready && <>
                        <View style={styles.form}>
                            <View>
                                <Text style={styles.label}>Your rating</Text>
                                <View style={styles.stars}>
                                    {stars.map((star) => (
                                        <Pressable
                                            key={star}
                                            style={styles.starButton}
                                            disabled={submitting}
                                            onPress={() => setRating(star)}
                                            accessibilityRole="button"
                                            accessibilityLabel={`${star} out of 5 stars`}
                                            accessibilityState={{ selected: star === rating, disabled: submitting }}
                                        >
                                            <Text style={[styles.star, star > rating && styles.emptyStar]}>
                                                {star <= rating ? '★' : '☆'}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Comment</Text>
                                <TextInput
                                    style={styles.commentInput}
                                    value={comment}
                                    editable={!submitting}
                                    onChangeText={setComment}
                                    placeholder="Share your experience with this product"
                                    placeholderTextColor="#999999"
                                    multiline
                                    autoCapitalize="sentences"
                                    accessibilityLabel="Comment"
                                />
                            </View>

                            <Text style={styles.label}>Photo uploads are not available yet.</Text>
                        </View>

                        {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
                        <Pressable style={[styles.saveButton, submitting && styles.disabledButton]} onPress={handleSave} disabled={submitting} accessibilityRole="button" accessibilityState={{ disabled: submitting, busy: submitting }}>
                            <Text style={styles.saveButtonText}>
                                {submitting ? 'Saving...' : isEditing ? 'Save changes' : 'Post review'}
                            </Text>
                        </Pressable>
                    </>}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    status: {
        gap: 12,
    },
    error: {
        marginTop: 16,
        fontSize: 14,
        lineHeight: 22,
        color: '#B42318',
    },
    disabledButton: {
        opacity: 0.65,
    },
    screen: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    keyboardArea: {
        flex: 1,
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
        marginBottom: 24,
    },
    form: {
        gap: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666666',
        marginBottom: 6,
    },
    stars: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    starButton: {
        width: 44,
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    star: {
        fontSize: 32,
        color: '#946A00',
    },
    emptyStar: {
        color: '#AAAAAA',
    },
    commentInput: {
        minHeight: 160,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#D5D5D5',
        borderRadius: 10,
        fontSize: 16,
        lineHeight: 24,
        color: '#222222',
        backgroundColor: '#FFFFFF',
        textAlignVertical: 'top',
    },
    backLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#946A00',
    },
    saveButton: {
        marginTop: 24,
        minHeight: 52,
        paddingHorizontal: 20,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#222222',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
    },
});
