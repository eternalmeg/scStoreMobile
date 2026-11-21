import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as authService from '../services/authService';
import { AuthContext } from './AuthContext';

const TOKEN_KEY = 'scstore.accessToken';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const operationId = useRef(0);
    const retryLogout = useRef(false);
    const tokenWrite = useRef(null);

    const logout = useCallback(async () => {
        operationId.current += 1;
        const id = operationId.current;
        setUser(null);
        setToken(null);
        setLoading(true);
        setError('');
        retryLogout.current = true;
        try {

            if (tokenWrite.current) {
                try {
                    await tokenWrite.current;
                } catch {

                }
            }
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            retryLogout.current = false;
        } catch {
            if (id === operationId.current) {
                setError('Could not clear the saved session securely. Please try again.');
            }
        } finally {
            if (id === operationId.current) {
                setLoading(false);
            }
        }
    }, []);

    const restoreSession = useCallback(async () => {
        operationId.current += 1;
        const id = operationId.current;
        setLoading(true);
        setError('');
        setUser(null);
        setToken(null);
        try {
            const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
            if (id !== operationId.current) {
                return;
            }
            if (!savedToken) {
                return;
            }
            const currentUser = await authService.getCurrentUser(savedToken);
            if (id === operationId.current) {
                setToken(savedToken);
                setUser(currentUser);
            }
        } catch (error) {
            if (id !== operationId.current) {
                return;
            }
            if (error.status === 401 || error.status === 403) {
                await logout();
            } else {

                let message = 'Could not check your session. Please try again.';
                if (error.message) {
                    message = error.message;
                }
                setError(message);
            }
        } finally {
            if (id === operationId.current) {
                setLoading(false);
            }
        }
    }, [logout]);

    useEffect(() => {
        void restoreSession();
        return () => {
            operationId.current += 1;
        };
    }, [restoreSession]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', next => {
            if (next === 'active' && user) {
                void restoreSession();
            }
        });
        return () => {
            subscription.remove();
        };
    }, [user, restoreSession]);

    async function login(userData) {
        operationId.current += 1;
        const id = operationId.current;
        const accessToken = await authService.login(userData);
        await startSession(accessToken, id);
    }

    async function register(userData) {
        operationId.current += 1;
        const id = operationId.current;
        const accessToken = await authService.register(userData);
        try {
            await startSession(accessToken, id);
        } catch {

            throw new Error('Your account was created, but sign-in could not finish. Please use Log in.');
        }
    }

    async function startSession(accessToken, id) {
        if (id !== operationId.current) {
            return;
        }
        const currentUser = await authService.getCurrentUser(accessToken);
        if (id !== operationId.current) {
            return;
        }
        try {
            tokenWrite.current = SecureStore.setItemAsync(TOKEN_KEY, accessToken, {
                keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
            });
            await tokenWrite.current;
        } catch {
            if (id !== operationId.current) {
                return;
            }
            try {
                await SecureStore.deleteItemAsync(TOKEN_KEY);
            } catch {
                retryLogout.current = true;
                setError('Could not clear the saved session securely. Please try again.');
            }
            throw new Error('Could not save your session securely. Please try again.');
        }
        if (id === operationId.current) {
            setToken(accessToken);
            setUser(currentUser);
        }
    }

    function retry() {
        if (retryLogout.current) {
            return logout();
        }
        return restoreSession();
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, retry }}>
            {children}
        </AuthContext.Provider>
    );
}
