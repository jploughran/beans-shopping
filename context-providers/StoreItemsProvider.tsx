import { groupBy } from 'lodash';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import invariant from 'tiny-invariant';

import { useSelectedList } from './ListProvider';

import { ItemFormInitialValues } from '@/components/AddStoreItemForm';
import {
    addStoreItem,
    getItemsForStores,
    handleRemoveSupabaseRow,
} from '@/modules/supabase-list-utils';
import { ITEMS, StoreItem } from '@/types/list';
import { upsertIntoArray } from '@/utils/array-utils';

export interface StoreItemContextProvider {
    selectedStoreItems: StoreItem[] | undefined;
    selectedStoreId: number | undefined;
    selectedStoreName: string | undefined;
    setSelectedStoreId: React.Dispatch<React.SetStateAction<number | undefined>>;
    setSelectedStoreName: React.Dispatch<React.SetStateAction<string | undefined>>;
    handleUpdateStoreItem: (itemToUpdate: ItemFormInitialValues) => Promise<StoreItem>;
    handleRemoveListItem: (itemToRemoveId: number) => Promise<undefined>;
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
        return [...(allStoreItems[selectedStoreId] ?? [])];
    }, [allStoreItems, selectedStoreId]);

    useEffect(() => {
        const getStoreItems = async () => {
            console.log('[getStoreItems] store_id called');
            await getItemsForStores()
                .then((listItems) => {
                    setAllStoreItems(groupBy(listItems, 'store_id'));
                })
                .catch((e) => console.error(e));
        };
        getStoreItems();
    }, []);

    const handleUpdateStoreItem = useCallback(
        async (itemToUpdate: ItemFormInitialValues) => {
            if (!selectedStoreId) {
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
                    return Promise.reject(e);
                });
        },
        [selectedStoreId],
    );

    const handleRemoveListItem = useCallback(
        async (itemToRemoveId: number) => {
            if (!selectedStoreId) {
                console.error('Missing store Id [handleUpdateStoreItem]');
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
            handleRemoveListItem,
        };
    }, [
        handleRemoveListItem,
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
