import { create } from "zustand";

interface AuthFormState {
    email: string;
    password: string;

    username: string;
    confirmPassword: string;

    isLogin: boolean;
    error: string;

    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setUsername: (username: string) => void;
    setConfirmPassword: (password: string) => void;
    setIsLogin: (isLogin: boolean) => void;
    setError: (error: string) => void;
    clearForm: () => void;
    switchForm: () => void;

    validateLoginForm: () => string | null;
    validateSignupForm: () => string | null;
}

export const useAuthFormStore = create<AuthFormState>((set, get) => ({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
    isLogin: true,
    error: "",

    setEmail: (email) => set({ email }),
    setPassword: (password) => set({ password }),
    setUsername: (username) => set({ username }),
    setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
    setIsLogin: (isLogin) => set({ isLogin }),
    setError: (error) => set({ error }),

    clearForm: () =>
        set({
            email: "",
            password: "",
            username: "",
            confirmPassword: "",
            error: "",
        }),

    switchForm: () => {
        const { isLogin } = get();
        set({
            isLogin: !isLogin,
            error: "",
            password: "",
            username: "",
            confirmPassword: "",
        });
    },

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
