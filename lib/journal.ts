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

// ===== STORAGE UTILITIES (FIXED VERSION) =====
export const uploadImageToStorage = async (
    imageUri: string,
    userId: string
): Promise<ServiceResponse<string>> => {
    try {
        // Generate unique filename
        const timestamp = Date.now();
        const filename = `${userId}/${timestamp}.jpg`;

        // Method for React Native/Expo - Use FormData
        const formData = new FormData();
        formData.append("file", {
            uri: imageUri,
            type: "image/jpeg",
            name: filename,
        } as any);

        // Upload to Supabase storage
        const { data, error } = await supabase.storage
            .from("journal-images") // Make sure this bucket exists in your Supabase project
            .upload(filename, formData, {
                contentType: "image/jpeg",
                upsert: false,
            });

        if (error) {
            return { success: false, error: error.message };
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from("journal-images")
            .getPublicUrl(data.path);

        return { success: true, data: publicUrlData.publicUrl };
    } catch (error) {
        return {
            success: false,
            error: handleError(error, "Uploading image to storage"),
        };
    }
};

export const deleteImageFromStorage = async (
    imageUrl: string
): Promise<ServiceResponse<void>> => {
    try {
        console.log("Attempting to delete image:", imageUrl);

        // Supabase public URL format: https://[project-ref].supabase.co/storage/v1/object/public/[bucket-name]/[file-path]
        const url = new URL(imageUrl);
        const pathname = url.pathname;

        // Find the bucket name in the path
        const publicIndex = pathname.indexOf("/public/");
        if (publicIndex === -1) {
            console.error("Invalid Supabase storage URL format:", imageUrl);
            return { success: false, error: "Invalid storage URL format" };
        }

        // Extract everything after /public/bucket-name/
        const afterPublic = pathname.substring(publicIndex + "/public/".length);
        const pathParts = afterPublic.split("/");

        if (pathParts.length < 2) {
            console.error("Cannot extract file path from URL:", imageUrl);
            return {
                success: false,
                error: "Cannot extract file path from URL",
            };
        }

        // Skip bucket name (first part) and get the actual file path
        const filePath = pathParts.slice(1).join("/");

        console.log("Extracted file path:", filePath);

        const { error } = await supabase.storage
            .from("journal-images")
            .remove([filePath]);

        if (error) {
            console.error("Supabase storage deletion error:", error);
            return { success: false, error: error.message };
        }

        console.log("Successfully deleted image from storage");
        return { success: true };
    } catch (error) {
        console.error("Error in deleteImageFromStorage:", error);
        return {
            success: false,
            error: handleError(error, "Deleting image from storage"),
        };
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
        // Filter images that need to be uploaded (local images only)
        const localImages = journalData.images.filter(
            (image) => image.url.trim() && !image.url.startsWith("http")
        );

        // Upload local images to storage
        const uploadedImages: string[] = [];
        const uploadErrors: string[] = [];

        for (const image of localImages) {
            const uploadResult = await uploadImageToStorage(image.url, userId);
            if (uploadResult.success && uploadResult.data) {
                uploadedImages.push(uploadResult.data);
            } else {
                uploadErrors.push(uploadResult.error || "Unknown upload error");
            }
        }

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
            // Clean up uploaded images if journal creation fails
            for (const imageUrl of uploadedImages) {
                await deleteImageFromStorage(imageUrl);
            }
            return { success: false, error: journalError.message };
        }

        // Insert uploaded images to database
        let images: JournalImage[] = [];
        if (uploadedImages.length > 0) {
            const imageRecords = uploadedImages.map((url) => ({
                journal_id: journal.id,
                image_url: url,
            }));

            const { data: imagesData, error: imagesError } = await supabase
                .from("journal_images")
                .insert(imageRecords)
                .select();

            if (imagesError) {
                // Clean up uploaded images if database insert fails
                for (const imageUrl of uploadedImages) {
                    await deleteImageFromStorage(imageUrl);
                }
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

        // Return success with any upload errors as warnings
        const result = {
            success: true,
            data: {
                ...journal,
                journal_images: images,
                journal_tags: tags,
            },
        };

        if (uploadErrors.length > 0) {
            console.warn("Some images failed to upload:", uploadErrors);
        }

        return result;
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
    filter: JournalFilter
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
                const startOfMonth = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    1,
                    0,
                    0,
                    0,
                    0
                );
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
        // First get all images associated with this journal
        const { data: journalImages, error: getImagesError } = await supabase
            .from("journal_images")
            .select("image_url")
            .eq("journal_id", journalId);

        if (getImagesError) {
            console.warn(
                "Warning getting journal images:",
                getImagesError.message
            );
        }

        // Delete images from storage
        if (journalImages && journalImages.length > 0) {
            for (const image of journalImages) {
                await deleteImageFromStorage(image.image_url);
            }
        }

        // Delete journal images from database
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

        // Delete journal tags
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
    return {
        id: journal.id!,
        mood: journal.mood,
        content: journal.content,
        created_at: formatDate(journal.created_at),
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
        };

        return { success: true, data: stats };
    } catch (error) {
        return {
            success: false,
            error: handleError(error, "Getting journal stats"),
        };
    }
};
