import { supabase } from "./supabase";

// ===== TYPES =====
export interface Journal {
    id?: string;
    user_id?: string;
    mood: string;
    content: string;
    created_at: string;
}

export interface JournalImage {
    id?: string;
    journal_id: string;
    image_url: string;
}

export interface JournalTag {
    id?: string;
    journal_id: string;
    tag: string;
}

export interface JournalWithAssets extends Journal {
    journal_images?: JournalImage[];
    journal_tags?: JournalTag[];
}

export interface JournalFormData {
    mood: string;
    content: string;
    created_at: Date;
    images: Array<{ url: string }>;
    tags: Array<{ name: string }>;
}

export type JournalFilter = "all" | "today" | "this-week" | "this-month";
export type ServiceResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
};

// ===== UTILITIES =====
const handleError = (error: unknown, context: string): string => {
    console.error(`${context}:`, error);
    return error instanceof Error ? error.message : "Unknown error occurred";
};

const formatDate = (dateString: string): string => {
    try {
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    } catch (error) {
        return "Invalid date";
    }
};

// ===== CORE FUNCTIONS =====
export const getCurrentUserId = async (): Promise<ServiceResponse<string>> => {
    try {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error) return { success: false, error: error.message };
        if (!user) return { success: false, error: "User not authenticated" };

        return { success: true, data: user.id };
    } catch (error) {
        return {
            success: false,
            error: handleError(error, "Getting current user"),
        };
    }
};

export const createJournal = async (
    journalData: JournalFormData,
    userId: string
): Promise<ServiceResponse<JournalWithAssets>> => {
    try {
        // Insert main journal
        const { data: journal, error: journalError } = await supabase
            .from("journals")
            .insert({
                user_id: userId,
                mood: journalData.mood,
                content: journalData.content,
                created_at: journalData.created_at.toISOString(),
            })
            .select()
            .single();

        if (journalError) {
            return { success: false, error: journalError.message };
        }

        // Insert images if any
        const validImages = journalData.images
            .filter((img) => img.url.trim())
            .map((img) => ({
                journal_id: journal.id,
                image_url: img.url.trim(),
            }));

        let images: JournalImage[] = [];
        if (validImages.length > 0) {
            const { data: imagesData, error: imagesError } = await supabase
                .from("journal_images")
                .insert(validImages)
                .select();

            if (imagesError) {
                return {
                    success: false,
                    error: `Journal created but images failed: ${imagesError.message}`,
                };
            }
            images = imagesData || [];
        }

        // Insert tags if any
        const validTags = journalData.tags
            .filter((tag) => tag.name.trim())
            .map((tag) => ({
                journal_id: journal.id,
                tag: tag.name.trim(),
            }));

        let tags: JournalTag[] = [];
        if (validTags.length > 0) {
            const { data: tagsData, error: tagsError } = await supabase
                .from("journal_tags")
                .insert(validTags)
                .select();

            if (tagsError) {
                return {
                    success: false,
                    error: `Journal created but tags failed: ${tagsError.message}`,
                };
            }
            tags = tagsData || [];
        }

        return {
            success: true,
            data: {
                ...journal,
                journal_images: images,
                journal_tags: tags,
            },
        };
    } catch (error) {
        return {
            success: false,
            error: handleError(error, "Creating journal"),
        };
    }
};

export const getUserJournals = async (
    userId: string
): Promise<ServiceResponse<JournalWithAssets[]>> => {
    try {
        const { data: journals, error } = await supabase
            .from("journals")
            .select(
                `
                *,
                journal_images (*),
                journal_tags (*)
            `
            )
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) return { success: false, error: error.message };
        return { success: true, data: journals || [] };
    } catch (error) {
        return {
            success: false,
            error: handleError(error, "Fetching journals"),
        };
    }
};

export const getFilteredJournals = async (
    userId: string,
    filter: JournalFilter,
    filterValue?: string
): Promise<ServiceResponse<JournalWithAssets[]>> => {
    try {
        let query = supabase
            .from("journals")
            .select(
                `
                *,
                journal_images (*),
                journal_tags (*)
            `
            )
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        // Apply filters
        switch (filter) {
            case "today":
                const today = new Date();
                const startOfDay = new Date(today);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(today);
                endOfDay.setHours(23, 59, 59, 999);

                query = query
                    .gte("created_at", startOfDay.toISOString())
                    .lte("created_at", endOfDay.toISOString());
                break;
            case "this-week":
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                query = query.gte("created_at", sevenDaysAgo.toISOString());
                break;
            case "this-month":
                const now = new Date();
                // Awal bulan ini: tanggal 1, jam 00:00:00
                const startOfMonth = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    1,
                    0,
                    0,
                    0,
                    0
                );
                // Akhir bulan ini: tanggal terakhir bulan ini, jam 23:59:59.999
                const endOfMonth = new Date(
                    now.getFullYear(),
                    now.getMonth() + 1,
                    0,
                    23,
                    59,
                    59,
                    999
                );

                query = query
                    .gte("created_at", startOfMonth.toISOString())
                    .lte("created_at", endOfMonth.toISOString());
                break;
        }

        const { data: journals, error } = await query;
        if (error) return { success: false, error: error.message };
        return { success: true, data: journals || [] };
    } catch (error) {
        return {
            success: false,
            error: handleError(error, "Fetching filtered journals"),
        };
    }
};

export const deleteJournal = async (
    journalId: string
): Promise<ServiceResponse<void>> => {
    try {
        // First delete journal images
        const { error: imagesError } = await supabase
            .from("journal_images")
            .delete()
            .eq("journal_id", journalId);

        if (imagesError) {
            console.warn(
                "Warning deleting journal images:",
                imagesError.message
            );
        }

        // Then delete journal tags
        const { error: tagsError } = await supabase
            .from("journal_tags")
            .delete()
            .eq("journal_id", journalId);

        if (tagsError) {
            console.warn("Warning deleting journal tags:", tagsError.message);
        }

        // Finally delete the main journal
        const { error } = await supabase
            .from("journals")
            .delete()
            .eq("id", journalId);

        if (error) return { success: false, error: error.message };
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: handleError(error, "Deleting journal"),
        };
    }
};

// ===== TRANSFORM UTILITIES =====
export const transformJournalForCard = (journal: JournalWithAssets) => {
    const totalImages = journal.journal_images?.length || 0;
    const totalTags = journal.journal_tags?.length || 0;

    return {
        id: journal.id!,
        mood: journal.mood,
        content: journal.content,
        created_at: formatDate(journal.created_at),
        imagesCount: totalImages > 0 ? totalImages : undefined,
        tagsCount: totalTags > 0 ? totalTags : undefined,
        images: journal.journal_images?.map((img) => ({
            id: img.id,
            url: img.image_url,
        })),
        tags: journal.journal_tags?.map((tag) => ({
            id: tag.id,
            name: tag.tag,
        })),
    };
};

// ===== ANALYTICS =====
export const getJournalStats = async (
    userId: string
): Promise<
    ServiceResponse<{
        total: number;
        thisWeek: number;
        thisMonth: number;
        moods: Record<string, number>;
        tagsCount: number;
    }>
> => {
    try {
        const { data: journals, error } = await supabase
            .from("journals")
            .select(
                `
                mood,
                created_at,
                journal_tags (tag)
            `
            )
            .eq("user_id", userId);

        if (error) return { success: false, error: error.message };

        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Count moods
        const moods: Record<string, number> = {};
        journals.forEach((journal) => {
            moods[journal.mood] = (moods[journal.mood] || 0) + 1;
        });

        // Count unique tags
        const uniqueTags = new Set();
        journals.forEach((journal) => {
            journal.journal_tags?.forEach((tag: any) => {
                uniqueTags.add(tag.tag);
            });
        });

        const stats = {
            total: journals.length,
            thisWeek: journals.filter(
                (j) => new Date(j.created_at) >= oneWeekAgo
            ).length,
            thisMonth: journals.filter(
                (j) => new Date(j.created_at) >= oneMonthAgo
            ).length,
            moods,
            tagsCount: uniqueTags.size,
        };

        return { success: true, data: stats };
    } catch (error) {
        return {
            success: false,
            error: handleError(error, "Getting journal stats"),
        };
    }
};

// ===== SEARCH UTILITIES =====
export const searchJournals = async (
    userId: string,
    searchTerm: string
): Promise<ServiceResponse<JournalWithAssets[]>> => {
    try {
        const { data: journals, error } = await supabase
            .from("journals")
            .select(
                `
                *,
                journal_images (*),
                journal_tags (*)
            `
            )
            .eq("user_id", userId)
            .or(`content.ilike.%${searchTerm}%,mood.ilike.%${searchTerm}%`)
            .order("created_at", { ascending: false });

        if (error) return { success: false, error: error.message };
        return { success: true, data: journals || [] };
    } catch (error) {
        return {
            success: false,
            error: handleError(error, "Searching journals"),
        };
    }
};
