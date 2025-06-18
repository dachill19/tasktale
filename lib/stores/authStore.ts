import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Alert } from "react-native";
import { create } from "zustand";

WebBrowser.maybeCompleteAuthSession();

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isInitialized: boolean;

    initialize: () => Promise<void>;
    signInWithEmail: (
        email: string,
        password: string
    ) => Promise<{ error?: string }>;
    signUpWithEmail: (
        username: string,
        email: string,
        password: string
    ) => Promise<{ error?: string }>;
    signInWithGoogle: () => Promise<{ error?: string }>;
    signOut: () => Promise<void>;
    handleDeepLink: (url: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    session: null,
    isLoading: false,
    isInitialized: false,

    initialize: async () => {
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            set({
                session,
                user: session?.user ?? null,
                isInitialized: true,
            });

            supabase.auth.onAuthStateChange(async (event, session) => {
                console.log("Auth state changed:", event, session?.user?.email);

                set({
                    session,
                    user: session?.user ?? null,
                });

                if (event === "SIGNED_IN" && session) {
                    setTimeout(() => {
                        router.replace("/(main)");
                    }, 100);
                } else if (event === "SIGNED_OUT") {
                    router.replace("/(auth)");
                }
            });

            const initialUrl = await Linking.getInitialURL();
            if (initialUrl) {
                await get().handleDeepLink(initialUrl);
            }

            Linking.addEventListener("url", ({ url }) => {
                get().handleDeepLink(url);
            });
        } catch (error) {
            console.error("Auth initialization error:", error);
            set({ isInitialized: true });
        }
    },

    handleDeepLink: async (url: string) => {
        try {
            console.log("Handling deep link:", url);

            if (
                url.includes("#access_token=") ||
                url.includes("?access_token=")
            ) {
                const urlParams = new URLSearchParams(
                    url.split("#")[1] || url.split("?")[1]
                );
                const accessToken = urlParams.get("access_token");
                const refreshToken = urlParams.get("refresh_token");

                if (accessToken) {
                    const { data, error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken || "",
                    });

                    if (error) {
                        console.error("Error setting session:", error);
                        return;
                    }

                    if (data.session) {
                        console.log(
                            "Session set from URL:",
                            data.session.user?.email
                        );
                        set({
                            session: data.session,
                            user: data.session.user,
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Deep link handling error:", error);
        }
    },

    signInWithEmail: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (error) {
                return { error: error.message };
            }

            return {};
        } catch (error) {
            return { error: "An unexpected error occurred" };
        } finally {
            set({ isLoading: false });
        }
    },

    signUpWithEmail: async (
        username: string,
        email: string,
        password: string
    ) => {
        set({ isLoading: true });

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    data: {
                        username: username.trim(),
                        full_name: username.trim(),
                    },
                },
            });

            if (error) {
                return { error: error.message };
            }

            return {};
        } catch (error) {
            return { error: "An unexpected error occurred" };
        } finally {
            set({ isLoading: false });
        }
    },

    signInWithGoogle: async () => {
        set({ isLoading: true });

        try {
            const redirectUrl = Linking.createURL("/(main)");
            console.log("Redirect URL:", redirectUrl);

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: redirectUrl,
                    queryParams: {
                        access_type: "offline",
                        prompt: "consent",
                    },
                },
            });

            if (error) {
                console.error("OAuth init error:", error);
                return { error: `Google login failed: ${error.message}` };
            }

            if (data?.url) {
                console.log("Opening auth session:", data.url);

                const result = await WebBrowser.openAuthSessionAsync(
                    data.url,
                    redirectUrl
                );

                console.log("Auth session result:", result);

                if (result.type === "success" && result.url) {
                    await get().handleDeepLink(result.url);

                    const { data: sessionData } =
                        await supabase.auth.getSession();

                    if (sessionData.session) {
                        console.log(
                            "Session confirmed:",
                            sessionData.session.user?.email
                        );
                        set({
                            session: sessionData.session,
                            user: sessionData.session.user,
                        });
                        return {};
                    } else {
                        return {
                            error: "Authentication failed. Please try again.",
                        };
                    }
                } else if (result.type === "cancel") {
                    return { error: "Login cancelled" };
                } else {
                    return { error: "Login failed. Please try again." };
                }
            } else {
                return { error: "Failed to initialize Google login" };
            }
        } catch (error) {
            console.error("Google login error:", error);
            return { error: "Google login failed. Please try again." };
        } finally {
            set({ isLoading: false });
        }
    },

    signOut: async () => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                Alert.alert("Logout Failed", error.message);
            } else {
                Alert.alert("Logout Successful");
                set({ user: null, session: null });
            }
        } catch (error) {
            Alert.alert("Error", "Failed to logout");
        }
    },
}));

export const useIsAuthenticated = () => {
    const { user, session } = useAuthStore();
    return !!(user && session);
};
