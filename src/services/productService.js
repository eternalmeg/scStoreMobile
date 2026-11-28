import { request } from './requestHelper';

export async function getAll() {
    const products = await request('/devices');
    if (!Array.isArray(products)) {
        throw new Error('Unexpected product list. Please try again.');
    }
    if (products.some(product =>
        !product || typeof product._id !== 'string' ||
        typeof product.brand !== 'string' || typeof product.model !== 'string' ||
        typeof product.price !== 'number'
    )) {
        throw new Error('Unexpected product data. Please try again.');
    }
    return products;
}

export async function getOne(productId) {
    const product = await request(`/devices/${productId}`);
    if (!product || typeof product._id !== 'string' ||
        typeof product.brand !== 'string' || typeof product.model !== 'string' ||
        typeof product.price !== 'number') {
        throw new Error('Unexpected product data. Please try again.');
    }
    return product;
}
