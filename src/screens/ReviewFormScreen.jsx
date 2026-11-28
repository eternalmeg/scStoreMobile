import { useState } from 'react';
import { Alert, Image, Keyboard, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { products } from '../data/products';
import { reviews } from '../data/reviews';

const stars = [1, 2, 3, 4, 5];

export default function ReviewFormScreen() {
    const { productId, productName, reviewId } = useLocalSearchParams();
    const product = products.find(item => item.id === productId);
    let name = '';
    if (typeof productName === 'string') name = productName;
    if (product) name = product.name;
    const review = reviews.find(item => item._id === reviewId && item.productId === productId);
    const isEditing = Boolean(reviewId);
    let initialRating = 0;
    let initialComment = '';
    let imageUrl = null;
    if (isEditing && review) {
        initialRating = review.rating;
        initialComment = review.comment;
        imageUrl = review.imageUrl;
    }
    const [rating, setRating] = useState(initialRating);
    const [comment, setComment] = useState(initialComment);

    if (typeof productId !== 'string' || !name.trim() || (isEditing && !review)) {
        return (
            <SafeAreaView style={[styles.screen, styles.content]} edges={['top', 'left', 'right']}>
                <Text style={styles.headerTitle}>Product or review not found</Text>
                <Link href="/catalog" dismissTo style={styles.photoButtonText}>Back to Catalog</Link>
            </SafeAreaView>
        );
    }

    const reviewsRoute = { pathname: '/catalog/[productId]/reviews', params: { productId, productName: name } };

    function handleSave() {
        Keyboard.dismiss();
        Alert.alert('Demo review', 'The review is not saved. The app is using static data.', [
            { text: 'OK', onPress: () => router.dismissTo(reviewsRoute) },
        ]);
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
                            <Pressable accessibilityRole="button" accessibilityLabel="Back to Reviews" hitSlop={12}>
                                <Text style={styles.backArrow}>←</Text>
                            </Pressable>
                        </Link>
                        <Text style={styles.headerTitle} accessibilityRole="header">
                            {isEditing ? 'Edit review' : 'Write a review'}
                        </Text>
                    </View>

                    <Text style={styles.productName}>{name}</Text>

                    <View style={styles.form}>
                        <View>
                            <Text style={styles.label}>Your rating</Text>
                            <View style={styles.stars}>
                                {stars.map((star) => (
                                    <Pressable
                                        key={star}
                                        style={styles.starButton}
                                        onPress={() => setRating(star)}
                                        accessibilityRole="button"
                                        accessibilityLabel={`${star} out of 5 stars`}
                                        accessibilityState={{ selected: rating === star }}
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
                                onChangeText={setComment}
                                placeholder="Share your experience with this product"
                                placeholderTextColor="#999999"
                                multiline
                                autoCapitalize="sentences"
                                accessibilityLabel="Comment"
                            />
                        </View>

                        <View style={styles.photoSection}>
                            {imageUrl && (
                                <View style={styles.photoFrame}>
                                    <Image
                                        source={imageUrl}
                                        style={styles.reviewImage}
                                        resizeMode="contain"
                                        accessibilityLabel="Alex Morgan's review photo"
                                    />
                                </View>
                            )}
                            <View style={styles.photoButton}>
                                <Text style={styles.photoButtonText}>
                                    {imageUrl ? 'Change photo' : 'Add photo (optional)'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Pressable style={styles.saveButton} onPress={handleSave} accessibilityRole="button">
                        <Text style={styles.saveButtonText}>
                            {isEditing ? 'Save changes' : 'Post review'}
                        </Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
    photoSection: {
        alignItems: 'flex-start',
        gap: 12,
    },
    photoFrame: {
        width: '72%',
        height: 140,
        padding: 8,
        borderRadius: 10,
        backgroundColor: '#F6F6F6',
    },
    reviewImage: {
        width: '100%',
        height: '100%',
    },
    photoButton: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#D5D5D5',
        borderRadius: 8,
    },
    photoButtonText: {
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
