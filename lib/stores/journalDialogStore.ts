import { create } from "zustand";

interface JournalImage {
    id?: string;
    url: string;
    isLocal?: boolean; // For tracking upload status
}

interface JournalDialogState {
    // Form data
    mood: string;
    content: string;
    created_at: Date;
    images: JournalImage[];
    tags: string; // Simplified: just store as comma-separated string

    // UI state
    isLoading: boolean;
    showDatePicker: boolean;

    // Upload state
    isUploading: boolean;
    uploadingImageIndex: number | null;
    uploadProgress: string;

    // ID generator for images only
    nextImageId: number;

    // Form actions
    setMood: (mood: string) => void;
    setContent: (content: string) => void;
    setCreatedAt: (date: Date) => void;
    setTags: (tags: string) => void;

    // Image actions
    addImage: (url: string, isLocal?: boolean) => JournalImage;
    removeImage: (id: string) => void;
    updateImageUrl: (id: string, newUrl: string) => void;
    setImageAsUploaded: (id: string) => void;

    // Upload actions
    setUploading: (isUploading: boolean) => void;
    setUploadingImageIndex: (index: number | null) => void;
    setUploadProgress: (progress: string) => void;

    // UI actions
    setLoading: (isLoading: boolean) => void;
    toggleDatePicker: (show?: boolean) => void;

    // Form validation
    isFormValid: () => boolean;
    hasLocalImages: () => boolean;

    // Form management
    resetForm: () => void;
    getFormData: () => {
        mood: string;
        content: string;
        images: Array<{ url: string; isLocal?: boolean }>;
        tags: string;
    };
}

export const useJournalDialogStore = create<JournalDialogState>((set, get) => ({
    // Initial state
    mood: "",
    content: "",
    created_at: new Date(),
    images: [],
    tags: "", // Simple string
    isLoading: false,
    showDatePicker: false,
    isUploading: false,
    uploadingImageIndex: null,
    uploadProgress: "",
    nextImageId: 0,

    // Form actions
    setMood: (mood) => set({ mood }),
    setContent: (content) => set({ content }),
    setCreatedAt: (created_at) => set({ created_at }),
    setTags: (tags) => set({ tags }),

    // Image actions
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

    updateImageUrl: (id, newUrl) =>
        set((state) => ({
            images: state.images.map((img) =>
                img.id === id ? { ...img, url: newUrl } : img
            ),
        })),

    setImageAsUploaded: (id) =>
        set((state) => ({
            images: state.images.map((img) =>
                img.id === id ? { ...img, isLocal: false } : img
            ),
        })),

    // Upload actions
    setUploading: (isUploading) => set({ isUploading }),
    setUploadingImageIndex: (uploadingImageIndex) =>
        set({ uploadingImageIndex }),
    setUploadProgress: (uploadProgress) => set({ uploadProgress }),

    // UI actions
    setLoading: (isLoading) => set({ isLoading }),
    toggleDatePicker: (show) =>
        set((state) => ({ showDatePicker: show ?? !state.showDatePicker })),

    // Form validation
    isFormValid: () => {
        const state = get();
        return !!(state.mood && state.content.trim());
    },

    hasLocalImages: () => {
        const state = get();
        return state.images.some((img) => img.isLocal);
    },

    // Form management
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
            isUploading: false,
            uploadingImageIndex: null,
            uploadProgress: "",
            nextImageId: 0,
        }),
}));
