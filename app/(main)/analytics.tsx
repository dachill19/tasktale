import { TaskDialog } from "@/components/TaskDialog";
import React, { useState } from "react";
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
    return (
        <YStack gap="$3" padding="$4">
            <TaskDialog
                open={open}
                onOpenChange={setOpen}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        </YStack>
    );
}
