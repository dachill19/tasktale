import { useAuthStore } from "@/lib/stores/authStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
    const { session, isInitialized } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isInitialized) return;

        if (session) {
            router.replace("/(main)");
        } else {
            router.replace("/(auth)");
        }
    }, [session, isInitialized]);

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <ActivityIndicator size="large" color="#4CAF50" />
        </View>
    );
}
