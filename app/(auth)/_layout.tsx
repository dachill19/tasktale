import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false, // ini yang menghilangkan header
            }}
        />
    );
}
