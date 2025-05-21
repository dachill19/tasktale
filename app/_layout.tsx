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
                    {/* <PortalProvider shouldAddRootHost> */}
                    <SafeAreaProvider>
                        <Stack>
                            <Stack.Screen
                                name="(main)"
                                options={{
                                    headerShown: false,
                                }}
                            />
                        </Stack>
                    </SafeAreaProvider>
                    {/* </PortalProvider> */}
                </Theme>
            </Theme>
        </TamaguiProvider>
    );
}


//test