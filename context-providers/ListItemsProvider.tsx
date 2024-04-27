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

import {
    addListItem,
    getListItemsWithData,
    handleRemoveSupabaseRow,
    updateListItem,
} from '@/modules/supabase-list-utils';
import { LIST_ITEMS, ListItem, ListItemWithData } from '@/types/list';
import { supabase } from '@/modules/supabase';

export interface ListItemsProviderContextValues {
    handleRemoveListItem: (itemToRemoveId: number) => Promise<void>;
    itemsWithCost: ListItemWithData[];
    setItemsWithCost: Dispatch<SetStateAction<ListItemWithData[]>>;
    handleUpdateListItem: (itemToUpdate: ListItemWithData) => Promise<void>;
}

export const ListItemsProviderContext = createContext<ListItemsProviderContextValues | null>(null);

export const ListItemsProvider = ({
    children,
}: Record<string, unknown> & {
    children?: React.ReactNode;
}) => {
    const [itemsWithCost, setItemsWithCost] = useState<ListItemWithData[]>([]);
    const listId = useSelectedList()?.list_id;
    useEffect(() => {
        if (listId) {
            const getListItems = async () => {
                await getListItemsWithData(listId)
                    .then((listItems) => setItemsWithCost(listItems))
                    .catch((e) => console.error(e));
            };
            getListItems();
        }

        return () => {
            supabase.removeAllChannels();
        };
    }, [listId]);

    const handleUpdateListItem = useCallback(async (itemToUpdate: ListItemWithData) => {
        await updateListItem(itemToUpdate)
            .then((updatedItem) => {
                setItemsWithCost((prev) =>
                    prev.reduce((itemsToReturn, currentItem) => {
                        if (currentItem.list_item_id === updatedItem.list_item_id) {
                            itemsToReturn.push(updatedItem);
                        } else {
                            itemsToReturn.push(currentItem);
                        }
                        return itemsToReturn;
                    }, [] as ListItemWithData[]),
                );
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
            itemsWithCost,
            setItemsWithCost,
            handleRemoveListItem,
            handleUpdateListItem,
        };
    }, [handleRemoveListItem, handleUpdateListItem, itemsWithCost]);

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
