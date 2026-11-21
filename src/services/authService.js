import { request } from './requestHelper';

export async function register(userData) {
    const result = await request('/auth/register', 'POST', userData);
    if (result && typeof result.accessToken === 'string' && result.accessToken) {
        return result.accessToken;
    }

    try {
        return await login({ email: userData.email, password: userData.password });
    } catch {
        throw new Error('Your account was created, but sign-in could not finish. Please use Log in.');
    }
}

export async function login(userData) {
    const result = await request('/auth/login', 'POST', userData);
    if (!result || typeof result.accessToken !== 'string' || !result.accessToken) {
        throw new Error('Invalid session. Please try again.');
    }
    return result.accessToken;
}

export async function getCurrentUser(token) {
    const user = await request('/auth/users/me', 'GET', undefined, token);
    if (user === null) {
        const error = new Error('This account is no longer available.');
        error['status'] = 401;
        throw error;
    }
    if (!user || typeof user._id !== 'string' || !user._id) {
        throw new Error('Unexpected profile. Please try again.');
    }
    if (typeof user.email !== 'string' || !user.email.trim()) {
        throw new Error('Unexpected profile. Please try again.');
    }
    const currentUser = {
        _id: user._id,
        email: user.email,
        firstName: '',
        lastName: '',
        phone: '',
        role: 'user',
    };
    if (typeof user.firstName === 'string') {
        currentUser.firstName = user.firstName;
    }
    if (typeof user.lastName === 'string') {
        currentUser.lastName = user.lastName;
    }
    if (typeof user.phone === 'string') {
        currentUser.phone = user.phone;
    }
    if (typeof user.role === 'string') {
        currentUser.role = user.role;
    }
    return currentUser;
}
