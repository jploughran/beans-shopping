import { Redirect, Stack } from 'expo-router';
import { SizableText } from 'tamagui';

export default function AppLayout() {
    // This layout can be deferred because it's not the root layout.
    return (
        <Stack initialRouteName="/(tabs)">
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
}
