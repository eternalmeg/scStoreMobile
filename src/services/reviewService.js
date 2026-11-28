import { request } from './requestHelper';
import * as productService from './productService';

export async function getProductReviews(productId) {
    const product = await productService.getOne(productId);
    const reviews = Object.values(product.reviewList || {}).filter(review => review !== null);
    if (reviews.some(review =>
        !review || typeof review._id !== 'string' ||
        !Number.isFinite(review.rating) || review.rating < 1 || review.rating > 5 ||
        typeof review.comment !== 'string'
    )) {
        throw new Error('Unexpected review data. Please try again.');
    }
    reviews.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return { product, reviews };
}

export async function getOne(reviewId, token) {
    const reviews = await request('/reviews/userReviews', 'GET', undefined, token);
    if (!Array.isArray(reviews)) {
        throw new Error('Unexpected review data. Please try again.');
    }
    const review = reviews.find(item => item?._id === reviewId);
    if (!review) {
        throw new Error('Review not found or you no longer have permission to edit it.');
    }
    return review;
}

export function createReview(data, token) {
    return request('/reviews', 'POST', data, token);
}

export function updateReview(reviewId, data, token) {
    return request(`/reviews/${reviewId}`, 'PUT', data, token);
}

export function deleteReview(reviewId, token) {
    return request(`/reviews/${reviewId}`, 'DELETE', undefined, token);
}
