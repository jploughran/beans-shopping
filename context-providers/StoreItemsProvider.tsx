import { groupBy } from 'lodash';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import invariant from 'tiny-invariant';

import { addStoreItem, getItemsForStores } from '@/modules/supabase-list-utils';
import { StoreItem } from '@/types/list';

export interface StoreItemContextProvider {
    selectedStoreItems: StoreItem[] | undefined;
    setSelectedStoreId: React.Dispatch<React.SetStateAction<number | undefined>>;
    handleUpdateStoreItem: (itemToUpdate: Omit<StoreItem, 'created_at'>) => Promise<StoreItem>;
    selectedStoreId: number | undefined;
}

export const StoreItemProviderContext = createContext<StoreItemContextProvider | null>(null);

const updateStoreItemInArray = (list: StoreItem[] | undefined, updatedItem: StoreItem) => {
    const newData =
        list?.reduce((itemsToReturn, currentItem) => {
            if (currentItem.item_id === updatedItem.item_id) {
                itemsToReturn.push(updatedItem);
            } else {
                itemsToReturn.push(currentItem);
            }
            return itemsToReturn;
        }, [] as StoreItem[]) ?? [];

    return [...newData];
};

export type AllStoreItems = Record<number, StoreItem[]>;

export const StoreItemProvider = ({
    children,
}: Record<string, unknown> & {
    children?: React.ReactNode;
}) => {
    const [allStoreItems, setAllStoreItems] = useState<AllStoreItems>();
    const [selectedStoreId, setSelectedStoreId] = useState<number>();

    const selectedStoreItems = useMemo(() => {
        if (!selectedStoreId || !allStoreItems) {
            return undefined;
        }
        return allStoreItems[selectedStoreId];
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
        async (itemToUpdate: Omit<StoreItem, 'created_at'>) => {
            if (!selectedStoreId) {
                return Promise.reject(new Error('Missing store Id [handleUpdateStoreItem]'));
            }
            return addStoreItem(itemToUpdate)
                .then((updatedItem) => {
                    setAllStoreItems((prev) => ({
                        ...prev,
                        [selectedStoreId]: updateStoreItemInArray(
                            prev?.[selectedStoreId],
                            updatedItem,
                        ),
                    }));
                    return updatedItem;
                })
                .catch((e) => {
                    console.log('Error in [handleUpdateStoreItem]', { e });
                    return Promise.reject(e);
                });
        },
        [selectedStoreId],
    );

    const contextValue: StoreItemContextProvider = useMemo(() => {
        return {
            setSelectedStoreId,
            selectedStoreItems,
            handleUpdateStoreItem,
            selectedStoreId,
        };
    }, [handleUpdateStoreItem, selectedStoreId, selectedStoreItems]);

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
