import { Redirect, Stack } from 'expo-router';

import { ListItemsProvider } from '@/context-providers/ListItemsProvider';
import { ListsProvider } from '@/context-providers/ListProvider';
import { useUserProviderContext } from '@/context-providers/UserProvider';

export default function AppLayout() {
    const { session } = useUserProviderContext();

    if (!session) {
        return <Redirect href="/sign-in" />;
    }
    return (
        <ListsProvider>
            <ListItemsProvider>
                <Stack initialRouteName="/(tabs)">
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen
                        name="editList"
                        options={{
                            headerShown: true,
                            headerBackVisible: true,
                            headerBackTitleVisible: false,
                            headerTitle: 'Edit List',
                        }}
                    />
                    <Stack.Screen
                        name="modal"
                        options={{ headerBackVisible: true, headerBackTitleVisible: false }}
                    />
                </Stack>
            </ListItemsProvider>
        </ListsProvider>
    );
}
