import { Redirect, Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { SizableText } from 'tamagui';

import EditListTopTabName from '@/components/EditListTopTabName';
import SimpleErrorBoundary from '@/components/SimpleErrorBoundary';
import { UpdateDialog } from '@/components/UpdateDialog';
import { BottomSheetProvider } from '@/context-providers/BottomSheetProvider';
import { ListItemsProvider } from '@/context-providers/ListItemsProvider';
import { ListsProvider } from '@/context-providers/ListProvider';
import { StoreItemProvider } from '@/context-providers/StoreItemsProvider';
import { useUserProviderContext } from '@/context-providers/UserProvider';
import { useUpdateModal } from '@/hooks/useUpdateModal';
import { breadcrumb } from '@/utils/logging';

export default function AppLayout() {
    const { session } = useUserProviderContext();
    const [appState, setAppState] = useState<AppStateStatus>('active');

    const { updateModal } = useUpdateModal(appState);

    const onAppStateChange = useCallback((currentAppState: AppStateStatus) => {
        // active, inactive, background
        if (['active', 'background'].includes(currentAppState)) {
            breadcrumb(`currentAppState === ${currentAppState}`, 'general');
            setAppState(currentAppState);
        }
    }, []);

    useEffect(() => {
        // watch app state changes
        const subscription = AppState.addEventListener('change', onAppStateChange);

        if (appState === 'active') {
            breadcrumb(`App foregrounded`, 'general');
            // watch for users changes

            return () => {
                // unsubscribe from app state listener
                subscription.remove();
                // unsubscribe from user listener
            };
        } else {
            return subscription.remove;
        }
    }, [appState, onAppStateChange]);

    if (!session) {
        return <Redirect href="/sign-in" />;
    }
    return (
        <SimpleErrorBoundary location="signed-in-layout">
            <ListsProvider>
                <ListItemsProvider>
                    <StoreItemProvider>
                        {updateModal ? <UpdateDialog /> : null}
                        <BottomSheetProvider>
                            <Stack initialRouteName="/(tabs)">
                                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                                <Stack.Screen
                                    name="edit-list"
                                    options={{
                                        headerShown: true,
                                        headerBackVisible: true,
                                        headerBackTitleVisible: false,
                                        headerTitle: () => <EditListTopTabName />,
                                    }}
                                />
                                <Stack.Screen
                                    name="create-list"
                                    options={{
                                        headerShown: true,
                                        headerBackVisible: true,
                                        headerBackTitleVisible: false,
                                        headerTitle: () => <SizableText>Create List</SizableText>,
                                    }}
                                />
                                <Stack.Screen
                                    name="modal"
                                    options={{
                                        headerBackVisible: true,
                                        headerBackTitleVisible: false,
                                        headerTitle: 'Settings',
                                    }}
                                />
                            </Stack>
                        </BottomSheetProvider>
                    </StoreItemProvider>
                </ListItemsProvider>
            </ListsProvider>
        </SimpleErrorBoundary>
    );
}
