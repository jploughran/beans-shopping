import {
    Dispatch,
    SetStateAction,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import invariant from 'tiny-invariant';

import { useSelectedList } from './ListProvider';

import { supabase } from '@/modules/supabase';
import {
    getListItemsForStore,
    getListItemsWithData,
    handleRemoveSupabaseRow,
    updateListItem,
} from '@/modules/supabase-list-utils';
import { LIST_ITEMS, ListItem, ListItemWithData } from '@/types/list';

export interface ListItemsProviderContextValues {
    allStoreItemsWithCost: ListItemWithData[];
    handleRemoveListItem: (itemToRemoveId: number) => Promise<void>;
    itemsWithCost: ListItemWithData[];
    setItemsWithCost: Dispatch<SetStateAction<ListItemWithData[]>>;
    handleUpdateListItem: (itemToUpdate: ListItemWithData) => Promise<void>;
    listItemsLoading: boolean;
}

export const ListItemsProviderContext = createContext<ListItemsProviderContextValues | null>(null);

export const ListItemsProvider = ({
    children,
}: Record<string, unknown> & {
    children?: React.ReactNode;
}) => {
    const [itemsWithCost, setItemsWithCost] = useState<ListItemWithData[]>([]);
    const [listItemsLoading, setListItemsLoading] = useState(true);
    const list = useSelectedList();
    const [allStoreItemsWithCost, setAllStoreItemsWithCost] = useState<ListItemWithData[]>([]);

    useEffect(() => {
        if (list?.list_id && list.store_id) {
            const getListItems = async () => {
                const { list_id, user_id, store_id } = list;
                setListItemsLoading(true);
                await Promise.all([
                    getListItemsWithData(list_id, user_id)
                        .then((listItems) => setItemsWithCost(listItems))
                        .catch((e) => console.error(e)),
                    getListItemsForStore(store_id, user_id)
                        .then((listItems) => setAllStoreItemsWithCost(listItems))
                        .catch((e) => console.error(e)),
                ]).finally(() => setListItemsLoading(false));
            };
            getListItems();
        }

        return () => {
            supabase.removeAllChannels();
        };
    }, [list]);

    const handleUpdateListItem = useCallback(async (itemToUpdate: ListItemWithData) => {
        await updateListItem(itemToUpdate)
            .then((updatedItem) => {
                setItemsWithCost((prev) => {
                    const newData = prev.reduce((itemsToReturn, currentItem) => {
                        if (currentItem.list_item_id === updatedItem.list_item_id) {
                            itemsToReturn.push(updatedItem);
                        } else {
                            itemsToReturn.push(currentItem);
                        }
                        return itemsToReturn;
                    }, [] as ListItemWithData[]);
                    console.log({ newData });
                    return [...newData];
                });
            })
            .catch((e) => console.log('Error in [handleUpdateListItem]', { e }));
    }, []);

    const handleRemoveListItem = useCallback(async (itemToRemoveId: number) => {
        handleRemoveSupabaseRow<ListItem>('list_item_id', itemToRemoveId, LIST_ITEMS).then(() => {
            setItemsWithCost((prev) =>
                prev.filter(({ list_item_id }) => list_item_id !== itemToRemoveId),
            );
        });
    }, []);

    const contextValue: ListItemsProviderContextValues = useMemo(() => {
        return {
            allStoreItemsWithCost,
            itemsWithCost,
            setItemsWithCost,
            handleRemoveListItem,
            handleUpdateListItem,
            listItemsLoading,
        };
    }, [
        allStoreItemsWithCost,
        handleRemoveListItem,
        handleUpdateListItem,
        itemsWithCost,
        listItemsLoading,
    ]);

    return (
        <ListItemsProviderContext.Provider value={contextValue}>
            {children}
        </ListItemsProviderContext.Provider>
    );
};

export const useListItemsProviderContext = () => {
    const ctx = useContext(ListItemsProviderContext);

    invariant(ctx, 'useListItemsProviderContext called outside of ListItemsProviderContext');

    return ctx;
};
