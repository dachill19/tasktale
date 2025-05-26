import { TaskDialog } from "@/components/TaskDialog";
import { logout } from "@/utils/auth";
import React, { useState } from "react";
import { Button } from "react-native";
import { YStack } from "tamagui";

export default function Analytics() {
    const [open, setOpen] = useState(false);

    const handleSave = () => {
        // Logic simpan data
        console.log("Save clicked");
        setOpen(false);
    };

    const handleCancel = () => {
        console.log("Cancel clicked");
        setOpen(false);
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <YStack gap="$3" padding="$4">
            <TaskDialog
                open={open}
                onOpenChange={setOpen}
                onSave={handleSave}
                onCancel={handleCancel}
            />
            <Button title="Logout" onPress={handleLogout} />
        </YStack>
    );
}
