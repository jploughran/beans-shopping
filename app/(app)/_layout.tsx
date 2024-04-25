import { Redirect, Stack } from 'expo-router';

import { ListsProvider } from '@/context-providers/ListProvider';
import { useUserProviderContext } from '@/context-providers/UserProvider';

export default function AppLayout() {
    // This layout can be deferred because it's not the root layout.
    const { session } = useUserProviderContext();

    console.log({ session });
    if (!session) {
        return <Redirect href="/sign-in" />;
    }
    return (
        <ListsProvider>
            <Stack initialRouteName="/(tabs)">
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="editList"
                    options={{ headerShown: true, headerBackVisible: true }}
                />
            </Stack>
        </ListsProvider>
    );
}
