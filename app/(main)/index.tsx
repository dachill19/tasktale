import { X } from "@tamagui/lucide-icons";
import {
    Button,
    Dialog,
    Fieldset,
    H1,
    H2,
    H3,
    H4,
    H5,
    H6,
    Input,
    Label,
    Paragraph,
    TooltipSimple,
    Unspaced,
    View,
    XStack,
    YStack,
} from "tamagui";

function DialogInstance() {
    return (
        <YStack p="$4">
            <Dialog modal>
                <Dialog.Trigger asChild>
                    <Button>Show Dialog</Button>
                </Dialog.Trigger>

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
                        enterStyle={{ opacity: 0, scale: 0.95 }}
                        exitStyle={{ opacity: 0 }}
                    />

                    <Dialog.Content
                        bordered
                        w={400}
                        h={400}
                        elevate
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
                        enterStyle={{ x: 0, y: -20, opacity: 0 }}
                        exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                        gap="$4"
                    >
                        <Dialog.Title>Edit profile</Dialog.Title>
                        <Dialog.Description>
                            Make changes to your profile here. Click save when
                            you're done.
                        </Dialog.Description>
                        <Fieldset gap="$4" horizontal>
                            <Label
                                width={130}
                                justifyContent="flex-end"
                                htmlFor="name"
                            >
                                Name
                            </Label>
                            <Input
                                flex={1}
                                id="name"
                                defaultValue="Nate Wienert"
                            />
                        </Fieldset>
                        <Fieldset gap="$4" horizontal>
                            <Label
                                width={130}
                                justifyContent="flex-end"
                                htmlFor="username"
                            >
                                <TooltipSimple
                                    label="Pick your favorite"
                                    placement="bottom-start"
                                >
                                    <Paragraph>Food</Paragraph>
                                </TooltipSimple>
                            </Label>
                        </Fieldset>

                        <XStack alignSelf="flex-end" gap="$4">
                            <DialogInstance />

                            <Dialog.Close displayWhenAdapted asChild>
                                <Button theme="green" aria-label="Close">
                                    Save changes
                                </Button>
                            </Dialog.Close>
                        </XStack>

                        <Unspaced>
                            <Dialog.Close asChild>
                                <Button
                                    position="absolute"
                                    top="$3"
                                    right="$3"
                                    size="$2"
                                    circular
                                    icon={X}
                                />
                            </Dialog.Close>
                        </Unspaced>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog>

            <H1>Heading 1</H1>
            <H2>Heading 2</H2>
            <H3>Heading 3</H3>
            <H4>Heading 4</H4>
            <H5>Heading 5</H5>
            <H6>Heading 6</H6>
        </YStack>
    );
}

export default function App() {
    return (
        <View gap="$4" justifyContent="center" alignItems="center">
            <DialogInstance />
        </View>
    );
}
