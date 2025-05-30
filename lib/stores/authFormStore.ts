// lib/stores/authFormStore.ts
import { create } from "zustand";

interface AuthFormState {
    // Login form
    email: string;
    password: string;

    // Signup form
    username: string;
    confirmPassword: string;

    // UI state
    isLogin: boolean;
    error: string;

    // Actions
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setUsername: (username: string) => void;
    setConfirmPassword: (password: string) => void;
    setIsLogin: (isLogin: boolean) => void;
    setError: (error: string) => void;
    clearForm: () => void;
    switchForm: () => void;

    // Validation
    validateLoginForm: () => string | null;
    validateSignupForm: () => string | null;
}

export const useAuthFormStore = create<AuthFormState>((set, get) => ({
    // Initial state
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
    isLogin: true,
    error: "",

    // Setters
    setEmail: (email) => set({ email }),
    setPassword: (password) => set({ password }),
    setUsername: (username) => set({ username }),
    setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
    setIsLogin: (isLogin) => set({ isLogin }),
    setError: (error) => set({ error }),

    // Clear form
    clearForm: () =>
        set({
            email: "",
            password: "",
            username: "",
            confirmPassword: "",
            error: "",
        }),

    // Switch between login and signup
    switchForm: () => {
        const { isLogin } = get();
        set({
            isLogin: !isLogin,
            error: "",
            // Keep email but clear other fields when switching
            password: "",
            username: "",
            confirmPassword: "",
        });
    },

    // Validation functions
    validateLoginForm: () => {
        const { email, password } = get();

        if (!email.trim() || !password.trim()) {
            return "Please fill in all fields";
        }

        if (!email.includes("@")) {
            return "Please enter a valid email address";
        }

        return null;
    },

    validateSignupForm: () => {
        const { username, email, password, confirmPassword } = get();

        if (
            !username.trim() ||
            !email.trim() ||
            !password.trim() ||
            !confirmPassword.trim()
        ) {
            return "Please fill in all fields";
        }

        if (!email.includes("@")) {
            return "Please enter a valid email address";
        }

        if (password.length < 6) {
            return "Password must be at least 6 characters long";
        }

        if (password !== confirmPassword) {
            return "Passwords do not match";
        }

        return null;
    },
}));
