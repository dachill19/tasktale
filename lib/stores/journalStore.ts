import {
    createJournal,
    deleteJournal,
    getCurrentUserId,
    getFilteredJournals,
    getJournalStats,
    JournalFilter,
    JournalFormData,
    JournalWithAssets,
    ServiceResponse,
    transformJournalForCard,
} from "@/lib/journal";
import { create } from "zustand";

interface JournalStats {
    total: number;
    thisWeek: number;
    thisMonth: number;
    moods: Record<string, number>;
}

interface JournalState {
    journals: any[];
    filter: JournalFilter;
    loading: boolean;
    error: string | null;
    currentUserId: string | null;
    stats: JournalStats | null;
    statsLoading: boolean;
    setFilter: (filter: JournalFilter) => void;
    fetchFilteredJournals: (
        userId: string,
        filter: JournalFilter
    ) => Promise<void>;
    createJournal: (
        journalData: JournalFormData,
        userId: string
    ) => Promise<ServiceResponse<JournalWithAssets>>;
    deleteJournal: (
        journalId: string
    ) => Promise<{ success: boolean; error?: string }>;
    fetchJournalStats: (userId: string) => Promise<void>;
    initializeUser: () => Promise<void>;
}

export const useJournalStore = create<JournalState>((set, get) => ({
    journals: [],
    filter: "all",
    loading: false,
    error: null,
    currentUserId: null,
    stats: null,
    statsLoading: false,

    setFilter: (filter) => set({ filter }),

    fetchFilteredJournals: async (userId, filter) => {
        set({ loading: true, error: null });
        const response = await getFilteredJournals(userId, filter);
        set({
            journals:
                response.success && response.data
                    ? response.data.map(transformJournalForCard)
                    : [],
            error: response.error || null,
            loading: false,
        });
    },

    createJournal: async (journalData, userId) => {
        set({ loading: true, error: null });
        const response = await createJournal(journalData, userId);
        if (response.success && response.data) {
            const newJournal = transformJournalForCard(
                response.data as JournalWithAssets
            );
            set((state) => ({
                journals: [newJournal, ...state.journals],
                error: null,
            }));

            // Refresh stats after creating new journal
            const currentState = get();
            if (currentState.currentUserId) {
                currentState.fetchJournalStats(currentState.currentUserId);
            }
        } else {
            set({ error: response.error || "Failed to create journal" });
        }
        set({ loading: false });
        return response;
    },

    deleteJournal: async (journalId) => {
        set({ loading: true, error: null });
        const response = await deleteJournal(journalId);
        if (response.success) {
            set((state) => ({
                journals: state.journals.filter(
                    (journal) => journal.id !== journalId
                ),
                error: null,
            }));

            // Refresh stats after deleting journal
            const currentState = get();
            if (currentState.currentUserId) {
                currentState.fetchJournalStats(currentState.currentUserId);
            }

            return { success: true };
        } else {
            set({ error: response.error });
            return {
                success: false,
                error: response.error || "Failed to delete journal",
            };
        }
    },

    fetchJournalStats: async (userId) => {
        set({ statsLoading: true });
        const response = await getJournalStats(userId);
        set({
            stats: response.success ? response.data || null : null,
            statsLoading: false,
        });
    },

    initializeUser: async () => {
        set({ loading: true, error: null });
        const response = await getCurrentUserId();
        set({
            currentUserId: response.success ? response.data : null,
            error: response.error || null,
            loading: false,
        });
    },
}));
