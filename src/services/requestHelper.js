let baseUrl = process.env.EXPO_PUBLIC_API_URL;
if (!baseUrl) {
    baseUrl = 'http://localhost:3000/api';
}


export async function request(path, method = 'GET', body, token) {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
        controller.abort();
    }, 15000);

    try {
        const headers = {
            Accept: 'application/json',
        };
        const options = {
            method,
            headers,
            signal: controller.signal,
        };
        options.credentials = 'omit';

        if (body !== undefined) {
            headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${baseUrl}${path}`, options);

        if (response.status === 204) {
            return null;
        }

        let data;
        try {
            data = await response.json();
        } catch {

            data = undefined;
        }
        if (controller.signal.aborted) {
            throw new Error('Request timed out.');
        }

        if (!response.ok) {
            let message = `The server could not complete the request (HTTP ${response.status}). Please try again.`;
            if (data && typeof data.message === 'string') {
                message = data.message;
            }
            const error = new Error(message);
            error['status'] = response.status;
            throw error;
        }
        if (data === undefined) {
            const error = new Error('The server returned an unexpected response. Please try again.');
            error['status'] = response.status;
            throw error;
        }
        return data;
    } catch (error) {
        if (typeof error.status === 'number') {
            throw error;
        }
        let message = 'Could not reach the server. Check your connection and try again.';
        if (controller.signal.aborted) {
            message = 'The server took too long to respond. Please try again.';
        }
        const networkError = new Error(message);
        networkError['status'] = 0;
        throw networkError;
    } finally {
        clearTimeout(timeout);
    }
}
