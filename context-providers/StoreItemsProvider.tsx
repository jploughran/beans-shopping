import { groupBy } from 'lodash';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import invariant from 'tiny-invariant';

import { sortItemsBySection } from './ListItemsProvider';
import { useSelectedList } from './ListProvider';

import { ItemFormInitialValues } from '@/components/AddStoreItemForm';
import {
    addStoreItem,
    getItemsForStores,
    handleRemoveSupabaseRow,
} from '@/modules/supabase-list-utils';
import { ITEMS, StoreItem } from '@/types/list';
import { upsertIntoArray } from '@/utils/array-utils';
import { breadcrumb, logError } from '@/utils/logging';

export interface StoreItemContextProvider {
    selectedStoreItems: StoreItem[] | undefined;
    selectedStoreId: number | undefined;
    selectedStoreName: string | undefined;
    setSelectedStoreId: React.Dispatch<React.SetStateAction<number | undefined>>;
    setSelectedStoreName: React.Dispatch<React.SetStateAction<string | undefined>>;
    handleUpdateStoreItem: (itemToUpdate: ItemFormInitialValues) => Promise<StoreItem>;
    handleRemoveStoreItem: (itemToRemoveId: number) => Promise<undefined>;
}

export const StoreItemProviderContext = createContext<StoreItemContextProvider | null>(null);

export type AllStoreItems = Record<number, StoreItem[]>;

export const StoreItemProvider = ({
    children,
}: Record<string, unknown> & {
    children?: React.ReactNode;
}) => {
    const listStoreId = useSelectedList()?.store_id;
    const [allStoreItems, setAllStoreItems] = useState<AllStoreItems>();
    const [selectedStoreId, setSelectedStoreId] = useState<number | undefined>(listStoreId);
    const [selectedStoreName, setSelectedStoreName] = useState<string | undefined>();

    useEffect(() => {
        if (listStoreId) {
            setSelectedStoreId(listStoreId);
        }
    }, [listStoreId]);

    const selectedStoreItems = useMemo(() => {
        if (!selectedStoreId || !allStoreItems) {
            return undefined;
        }
        return [
            ...(sortItemsBySection(
                allStoreItems[selectedStoreId]?.sort((a, b) =>
                    a.item_name.localeCompare(b.item_name),
                ) ?? [],
            ) ?? []),
        ];
    }, [allStoreItems, selectedStoreId]);

    useEffect(() => {
        const getStoreItems = async () => {
            breadcrumb('[getStoreItems] store_id called', 'supabase');
            await getItemsForStores()
                .then((listItems) => {
                    setAllStoreItems(groupBy(listItems, 'store_id'));
                })
                .catch((e) => logError(e, 1));
        };
        getStoreItems();
    }, []);

    const handleUpdateStoreItem = useCallback(
        async (itemToUpdate: ItemFormInitialValues) => {
            if (!selectedStoreId) {
                logError('Missing store Id [handleUpdateStoreItem]', 1);
                return Promise.reject(new Error('Missing store Id [handleUpdateStoreItem]'));
            }
            return addStoreItem(itemToUpdate)
                .then((updatedItem) => {
                    setAllStoreItems((prev) => {
                        const temp = {
                            ...prev,
                            [selectedStoreId]: upsertIntoArray<StoreItem>(
                                prev?.[selectedStoreId] ?? [],
                                updatedItem,
                                'item_id',
                            ),
                        };
                        return temp;
                    });
                    return updatedItem;
                })
                .catch((e) => {
                    console.log('Error in [handleUpdateStoreItem]', { e });
                    logError(e, 1);

                    return Promise.reject(e);
                });
        },
        [selectedStoreId],
    );

    const handleRemoveStoreItem = useCallback(
        async (itemToRemoveId: number) => {
            if (!selectedStoreId) {
                console.error('Missing store Id [handleUpdateStoreItem]');
                logError('Missing store Id [handleUpdateStoreItem]', 1);

                return Promise.reject(new Error('Missing store Id [handleUpdateStoreItem]'));
            }
            await handleRemoveSupabaseRow<StoreItem>('item_id', itemToRemoveId, ITEMS)
                .then(() => {
                    setAllStoreItems((prev) => ({
                        ...prev,
                        [selectedStoreId]:
                            prev?.[selectedStoreId].filter(
                                ({ item_id }) => item_id !== itemToRemoveId,
                            ) ?? [],
                    }));
                })
                .catch((e) => {
                    console.log('Error in [handleUpdateListItem]', { e });
                    logError(e, 1);
                    return Promise.reject(e);
                });
        },
        [selectedStoreId],
    );

    const contextValue: StoreItemContextProvider = useMemo(() => {
        return {
            setSelectedStoreId,
            selectedStoreItems,
            selectedStoreName,
            setSelectedStoreName,
            handleUpdateStoreItem,
            selectedStoreId,
            handleRemoveStoreItem,
        };
    }, [
        handleRemoveStoreItem,
        handleUpdateStoreItem,
        selectedStoreId,
        selectedStoreItems,
        selectedStoreName,
    ]);

    return (
        <StoreItemProviderContext.Provider value={contextValue}>
            {children}
        </StoreItemProviderContext.Provider>
    );
};

export const useStoreItemProviderContext = () => {
    const ctx = useContext(StoreItemProviderContext);

    invariant(ctx, 'useStoreItemProviderContext called outside of StoreItemProviderContext');

    return ctx;
};
