import { create } from "zustand";

interface JournalImage {
    id?: string;
    url: string;
    isLocal?: boolean;
}

interface JournalDialogState {
    mood: string;
    content: string;
    created_at: Date;
    images: JournalImage[];
    tags: string;

    isLoading: boolean;
    showDatePicker: boolean;

    nextImageId: number;

    setMood: (mood: string) => void;
    setContent: (content: string) => void;
    setCreatedAt: (date: Date) => void;
    setTags: (tags: string) => void;

    addImage: (url: string, isLocal?: boolean) => JournalImage;
    removeImage: (id: string) => void;

    setLoading: (isLoading: boolean) => void;
    toggleDatePicker: (show?: boolean) => void;

    isFormValid: () => boolean;

    resetForm: () => void;
    getFormData: () => {
        mood: string;
        content: string;
        images: Array<{ url: string; isLocal?: boolean }>;
        tags: string;
    };
}

export const useJournalDialogStore = create<JournalDialogState>((set, get) => ({
    mood: "",
    content: "",
    created_at: new Date(),
    images: [],
    tags: "",
    isLoading: false,
    showDatePicker: false,
    nextImageId: 0,

    setMood: (mood) => set({ mood }),
    setContent: (content) => set({ content }),
    setCreatedAt: (created_at) => set({ created_at }),
    setTags: (tags) => set({ tags }),

    addImage: (url, isLocal = false) => {
        const state = get();
        const newImage: JournalImage = {
            id: `temp-img-${state.nextImageId}`,
            url,
            isLocal,
        };

        set({
            images: [...state.images, newImage],
            nextImageId: state.nextImageId + 1,
        });

        return newImage;
    },

    removeImage: (id) =>
        set((state) => ({
            images: state.images.filter((img) => img.id !== id),
        })),

    setLoading: (isLoading) => set({ isLoading }),
    toggleDatePicker: (show) =>
        set((state) => ({ showDatePicker: show ?? !state.showDatePicker })),

    isFormValid: () => {
        const state = get();
        return !!(state.mood && state.content.trim());
    },

    getFormData: () => {
        const state = get();
        return {
            mood: state.mood,
            content: state.content,
            images: state.images.map((img) => ({
                url: img.url,
                isLocal: img.isLocal,
            })),
            tags: state.tags,
        };
    },

    resetForm: () =>
        set({
            mood: "",
            content: "",
            created_at: new Date(),
            images: [],
            tags: "",
            isLoading: false,
            showDatePicker: false,
            nextImageId: 0,
        }),
}));
