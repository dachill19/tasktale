import React from "react";
import { Button, Dialog, XStack } from "tamagui";

type FormDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    onSave: () => void;
    onCancel?: () => void;
};

export function FormDialog({
    open,
    onOpenChange,
    title,
    description,
    children,
    onSave,
    onCancel,
}: FormDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <Dialog.Trigger />
            <Dialog.Portal>
                <Dialog.Overlay
                    key="overlay"
                    backgroundColor="$shadow6"
                    animateOnly={["transform", "opacity"]}
                    animation={[
                        "quicker",
                        {
                            opacity: {
                                overshootClamping: true,
                            },
                        },
                    ]}
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Dialog.Content
                    bordered
                    mx="$4"
                    elevate
                    borderRadius="$6"
                    key="content"
                    animateOnly={["transform", "opacity"]}
                    animation={[
                        "quicker",
                        {
                            opacity: {
                                overshootClamping: true,
                            },
                        },
                    ]}
                    enterStyle={{ x: 0, y: 0, opacity: 0, scale: 0.7 }}
                    exitStyle={{ x: 0, y: 0, opacity: 0, scale: 0.7 }}
                    gap="$4"
                >
                    <Dialog.Title
                        fontSize="$8"
                        fontWeight="bold"
                        color="$green10"
                    >
                        {title}
                    </Dialog.Title>
                    {description && (
                        <Dialog.Description>{description}</Dialog.Description>
                    )}

                    {children}

                    <XStack justifyContent="flex-end" gap="$2">
                        <Dialog.Close asChild>
                            <Button
                                onPress={onCancel}
                                aria-label="Cancel"
                                themeInverse
                            >
                                Cancel
                            </Button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                            <Button
                                onPress={onSave}
                                aria-label="Save"
                                marginRight="$2"
                            >
                                Save
                            </Button>
                        </Dialog.Close>
                    </XStack>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
    );
}
