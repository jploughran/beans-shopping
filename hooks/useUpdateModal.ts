/* eslint-disable no-console */
import * as Updates from 'expo-updates';
import { useEffect, useMemo, useState } from 'react';
import { AppStateStatus } from 'react-native';
import usePromise from 'react-use/lib/usePromise';

export const useUpdateModal = (appState: AppStateStatus) => {
    const [updateModal, setUpdateModal] = useState<boolean>(false);
    const mounted = usePromise();

    useEffect(() => {
        const checkForUpdates = async () => {
            const updates = await mounted(
                Updates.checkForUpdateAsync().catch(() => {
                    return { isAvailable: false };
                }),
            );
            if (updates.isAvailable) {
                const updateReady = await mounted(
                    Updates.fetchUpdateAsync().catch((err) => console.warn(err)),
                );
                if (updateReady) {
                    setUpdateModal(!!updateReady);
                }
            }
        };
        if (appState === 'active') {
            try {
                checkForUpdates();
            } catch (error: unknown) {
                console.error(`Error checking or fetching update ${error}`);
            }
        }
    }, [appState, mounted]);

    return useMemo(
        () => ({
            updateModal,
            setUpdateModal,
        }),
        [updateModal],
    );
};
