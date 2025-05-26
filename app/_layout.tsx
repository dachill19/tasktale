import { tamaguiConfig } from "@/tamagui.config";
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider, Theme } from "tamagui";

export default function RootLayout() {
    return (
        <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
            <Theme name="light">
                <Theme name="green">
                    <SafeAreaProvider>
                        <Stack screenOptions={{ headerShown: false }} />
                    </SafeAreaProvider>
                </Theme>
            </Theme>
        </TamaguiProvider>
    );
}
