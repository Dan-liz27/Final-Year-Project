import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const userData = await authAPI.getCurrentUser();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to load user:', error);
                    // Token might be expired, clear it
                    localStorage.removeItem('access_token');
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const signup = async (username, email, password) => {
        try {
            console.log('AuthContext: Starting signup...', { username, email });
            setLoading(true);

            // Register user
            console.log('AuthContext: Registering user...');
            const userData = await authAPI.register(email, username, password);
            console.log('AuthContext: User registered:', userData);

            toast.success('Account created successfully! Please login to continue.');
            console.log('AuthContext: Signup complete, returning user data');
            return { success: true, email, username };
        } catch (error) {
            console.error('AuthContext: Signup error:', error);
            const message = error.response?.data?.detail || 'Failed to create account';
            toast.error(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setLoading(true);

            // Login and get token
            await authAPI.login(email, password);

            // Get user info
            const userData = await authAPI.getCurrentUser();
            setUser(userData);

            return true;
        } catch (error) {
            console.error('Login error:', error);
            const message = error.response?.data?.detail || 'Invalid email or password';
            toast.error(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authAPI.logout();
        setUser(null);
        toast.success('Logged out successfully!');
    };

    const value = {
        user,
        loading,
        signup,
        login,
        logout,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

