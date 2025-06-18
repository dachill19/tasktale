// lib/stores/profileStore.ts
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { create } from "zustand";

interface ProfileState {
    // State
    isLoading: boolean;
    error: string | null;

    // Actions
    updateProfile: (data: {
        full_name?: string;
        phone?: string;
        avatar_url?: string;
    }) => Promise<{ error?: string }>;
    clearError: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
    // Initial state
    isLoading: false,
    error: null,

    // Update profile
    updateProfile: async (data) => {
        set({ isLoading: true, error: null });

        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: data.full_name,
                    phone: data.phone,
                    avatar_url: data.avatar_url,
                },
            });

            if (error) {
                set({ error: error.message });
                return { error: error.message };
            }

            return {};
        } catch (error) {
            const errorMessage = "An unexpected error occurred";
            set({ error: errorMessage });
            return { error: errorMessage };
        } finally {
            set({ isLoading: false });
        }
    },

    // Clear error
    clearError: () => {
        set({ error: null });
    },
}));

// Helper hooks
export const useUserInfo = (user: User | null) => {
    const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
    const userEmail = user?.email || "";
    const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
    const userPhone = user?.user_metadata?.phone || "";
    const accountCreated = user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown";

    return {
        userName,
        userEmail,
        userAvatar,
        userPhone,
        accountCreated,
    };
};