import { groupBy } from 'lodash';
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
    getListItemsForStore,
    getListItemsWithData,
    handleRemoveSupabaseRow,
    updateListItem,
} from '@/modules/supabase-list-utils';
import { LIST_ITEMS, ListItem, ListItemWithData } from '@/types/list';

export interface ListItemsProviderContextValues {
    allStoreItemsWithCost: ListItemWithData[] | undefined;
    handleRemoveListItem: (itemToRemoveId: number) => Promise<void>;
    itemsWithCost: ListItemWithData[] | undefined;
    setItemsWithCost: Dispatch<SetStateAction<ListItemWithData[] | undefined>>;
    handleUpdateListItem: (itemToUpdate: ListItemWithData) => Promise<ListItemWithData>;
    listItemsLoading: boolean;
    unCheckedItems: ListItemWithData[] | undefined;
    setUncheckedItems: Dispatch<SetStateAction<ListItemWithData[] | undefined>>;
    checkedItems: ListItemWithData[] | undefined;
    setCheckedItems: Dispatch<SetStateAction<ListItemWithData[] | undefined>>;
}

const updateListItemInArray = (
    list: ListItemWithData[] | undefined,
    updatedItem: ListItemWithData,
) => {
    const newData =
        list?.reduce((itemsToReturn, currentItem) => {
            if (currentItem.list_item_id === updatedItem.list_item_id) {
                itemsToReturn.push(updatedItem);
            } else {
                itemsToReturn.push(currentItem);
            }
            return itemsToReturn;
        }, [] as ListItemWithData[]) ?? [];

    return [...newData];
};

export const ListItemsProviderContext = createContext<ListItemsProviderContextValues | null>(null);

export const ListItemsProvider = ({
    children,
}: Record<string, unknown> & {
    children?: React.ReactNode;
}) => {
    const [itemsWithCost, setItemsWithCost] = useState<ListItemWithData[]>();
    const [listItemsLoading, setListItemsLoading] = useState(true);
    const list = useSelectedList();
    const [allStoreItemsWithCost, setAllStoreItemsWithCost] = useState<ListItemWithData[]>([]);
    const [unCheckedItems, setUncheckedItems] = useState<ListItemWithData[]>();
    const [checkedItems, setCheckedItems] = useState<ListItemWithData[]>();

    useEffect(() => {
        // sort
        const sortedItems = itemsWithCost?.sort((a, b) => a.list_order - b.list_order);
        // lodash groupBy
        const groupedItems = groupBy(sortedItems, 'completed');
        setCheckedItems(groupedItems['true'] ?? []);
        setUncheckedItems(groupedItems['false'] ?? []);
    }, [itemsWithCost]);

    useEffect(() => {
        if (list?.list_id && list?.user_id) {
            const getListItems = async () => {
                console.log('[getListItemsWithData] list_id called');
                setListItemsLoading(true);
                await getListItemsWithData(list.list_id, list.user_id)
                    .then((listItems) => {
                        setItemsWithCost(listItems);
                    })
                    .catch((e) => console.error(e))
                    .finally(() => setListItemsLoading(false));
            };
            getListItems();
        }
    }, [list?.list_id, list?.user_id]);

    useEffect(() => {
        if (list?.store_id && list?.user_id) {
            const getListItems = async () => {
                console.log('[getListItemsForStore] store_id called');
                await getListItemsForStore(list.store_id, list.user_id)
                    .then((listItems) => setAllStoreItemsWithCost(listItems))
                    .catch((e) => console.error(e));
            };
            getListItems();
        }
    }, [list?.store_id, list?.user_id]);

    const handleUpdateListItem = useCallback(async (itemToUpdate: ListItemWithData) => {
        return updateListItem(itemToUpdate)
            .then((updatedItem) => {
                setItemsWithCost((prev) => updateListItemInArray(prev, updatedItem));
                setAllStoreItemsWithCost((prev) => updateListItemInArray(prev, updatedItem));
                return updatedItem;
            })
            .catch((e) => {
                console.log('Error in [handleUpdateListItem]', { e });
                return Promise.reject(e);
            });
    }, []);

    const handleRemoveListItem = useCallback(async (itemToRemoveId: number) => {
        handleRemoveSupabaseRow<ListItem>('list_item_id', itemToRemoveId, LIST_ITEMS).then(() => {
            setItemsWithCost((prev) => {
                const newItems =
                    prev?.filter(({ list_item_id }) => list_item_id !== itemToRemoveId) ?? [];
                return [...newItems];
            });
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
            checkedItems,
            setCheckedItems,
            setUncheckedItems,
            unCheckedItems,
        };
    }, [
        allStoreItemsWithCost,
        checkedItems,
        handleRemoveListItem,
        handleUpdateListItem,
        itemsWithCost,
        listItemsLoading,
        unCheckedItems,
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
