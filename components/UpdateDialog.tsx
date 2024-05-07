import * as Updates from 'expo-updates';
import { Adapt, Button, Dialog, Sheet, XStack } from 'tamagui';

export const UpdateDialog = () => {
    const reloadApp = async () => {
        await Updates.reloadAsync();
    };
    return (
        <Dialog modal open>
            <Adapt when="sm" platform="touch">
                <Sheet
                    snapPoints={[30]}
                    animation="medium"
                    zIndex={200000}
                    modal
                    dismissOnSnapToBottom
                >
                    <Sheet.Frame padding="$4" gap="$4">
                        <Adapt.Contents />
                    </Sheet.Frame>

                    <Sheet.Overlay
                        animation="lazy"
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                    />
                </Sheet>
            </Adapt>
            <Dialog.Portal>
                <Dialog.Overlay
                    key="overlay"
                    animation="slow"
                    opacity={0.5}
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Dialog.Content
                    bordered
                    elevate
                    key="content"
                    animateOnly={['transform', 'opacity']}
                    animation={[
                        'quicker',
                        {
                            opacity: {
                                overshootClamping: true,
                            },
                        },
                    ]}
                    enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                    exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                    gap="$4"
                >
                    <Dialog.Title size="$8">New Version Available</Dialog.Title>

                    <Dialog.Description>
                        Please refresh to make sure you have the most recent features and
                        improvements.
                    </Dialog.Description>

                    <XStack alignSelf="flex-end" gap="$4">
                        <Button
                            variant="outlined"
                            aria-label="Dismiss"
                            style={{ borderWidth: 0.75 }}
                            onPress={() => reloadApp()}
                        >
                            Dismiss
                        </Button>
                        <Button theme="active" aria-label="Close" onPress={() => reloadApp()}>
                            Reload App
                        </Button>
                    </XStack>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
    );
};
