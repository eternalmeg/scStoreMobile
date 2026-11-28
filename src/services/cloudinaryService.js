import { File } from 'expo-file-system';
import { request } from './requestHelper';

const uploadUrl = 'https://api.cloudinary.com/v1_1/daosxutfm/image/upload';
const uploadPreset = 'scstoreproducts';
const maxPhotoSize = 10 * 1024 * 1024;
const imageTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
};

export function validatePhoto(photo) {
    if (!photo || typeof photo.uri !== 'string' || !photo.uri) {
        throw new Error('Could not read the selected photo. Please try again.');
    }
    const extension = photo.uri.split('?')[0].split('.').pop().toLowerCase();
    const mimeType = imageTypes[extension] || photo.mimeType || photo.file?.type;
    if (!Object.values(imageTypes).includes(mimeType)) {
        throw new Error('Choose a JPEG, PNG or WebP photo.');
    }
    const fileSize = photo.fileSize ?? photo.file?.size;
    if (!Number.isFinite(fileSize) || fileSize <= 0) {
        throw new Error('Could not read the photo size. Please choose another photo.');
    }
    if (fileSize > maxPhotoSize) {
        throw new Error('Choose a photo no larger than 10 MB.');
    }
    const fileExtension = mimeType === 'image/jpeg' ? 'jpg' : mimeType.split('/')[1];
    return { ...photo, mimeType, fileSize, fileName: `review-photo.${fileExtension}` };
}

export async function uploadPhoto(photo) {
    const image = validatePhoto(photo);
    try {
        const formData = new FormData();
        const file = image.file || new File(image.uri);
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        const result = await request(uploadUrl, 'POST', formData, undefined, 60000);
        if (!result || typeof result.secure_url !== 'string' || !result.secure_url.startsWith('https://')) {
            throw new Error('Could not upload the photo. Please try again.');
        }
        return result.secure_url;
    } catch (error) {
        if (error.status === 0) throw error;
        if (error.status === 413) {
            throw new Error('The photo is too large. Choose a smaller photo.');
        }
        throw new Error('Could not upload the photo. Please try again.');
    }
}
