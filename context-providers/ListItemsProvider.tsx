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

import { InitialListItemFormValue } from '@/modules/add-list-item-validation';
import {
    getListItemsForStore,
    getListItemsWithData,
    handleRemoveSupabaseRow,
    updateListItem,
} from '@/modules/supabase-list-utils';
import { LIST_ITEMS, ListItem, ListItemWithData, StoreSection } from '@/types/list';
import { upsertIntoArray } from '@/utils/array-utils';
import { logError } from '@/utils/logging';

export interface ListItemsProviderContextValues {
    allStoreItemsWithCost: ListItemWithData[] | undefined;
    handleRemoveListItem: (itemToRemoveId: number) => Promise<void>;
    itemsWithCost: ListItemWithData[] | undefined;
    setItemsWithCost: Dispatch<SetStateAction<ListItemWithData[] | undefined>>;
    handleUpdateListItem: (itemToUpdate: InitialListItemFormValue) => Promise<ListItemWithData>;
    listItemsLoading: boolean;
    unCheckedItems: ListItemWithData[] | undefined;
    setUncheckedItems: Dispatch<SetStateAction<ListItemWithData[] | undefined>>;
    checkedItems: ListItemWithData[] | undefined;
    setCheckedItems: Dispatch<SetStateAction<ListItemWithData[] | undefined>>;
    setListItemsLoading: Dispatch<SetStateAction<boolean>>;
}

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
        if (itemsWithCost && itemsWithCost.length > 0) {
            // Sort items by item_name and then by store_section
            const sortedItems = sortItemsBySection(itemsWithCost);

            const groupedItems = groupBy(sortedItems, 'completed');
            setCheckedItems(groupedItems['true'] ?? []);
            setUncheckedItems(groupedItems['false'] ?? []);
        } else {
            setCheckedItems([]);
            setUncheckedItems([]);
        }
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

    const updateAllStoreItemsAndItemsWithCost = useCallback((updatedItem: ListItemWithData) => {
        console.log('updateAllStoreItemsAndItemsWithCost called', { updatedItem });
        setAllStoreItemsWithCost((prev) =>
            upsertIntoArray<ListItemWithData>(prev ?? [], updatedItem, 'list_item_id'),
        );
        setItemsWithCost((prev) => {
            const newList = upsertIntoArray<ListItemWithData>(
                prev ?? [],
                updatedItem,
                'list_item_id',
            );
            return newList;
        });
    }, []);

    // Optimistically update the itemsWithCost array with the new item and
    const handleUpdateListItem = useCallback(
        async (itemToUpdate: InitialListItemFormValue) => {
            console.log('handleUpdateListItem called', { itemToUpdate });
            if (itemToUpdate.item_id && itemToUpdate.list_item_id) {
                const itemToUpsert = {
                    ...itemToUpdate,
                    quantity: parseFloat(itemToUpdate?.quantity ?? '0'),
                    price: parseFloat(itemToUpdate?.price ?? '0'),
                } as ListItemWithData;
                updateAllStoreItemsAndItemsWithCost(itemToUpsert);
                updateListItem(itemToUpdate);
                return Promise.resolve(itemToUpsert);
            } else {
                return updateListItem(itemToUpdate)
                    .then((updatedItem) => {
                        updateAllStoreItemsAndItemsWithCost(updatedItem);
                        return updatedItem;
                    })
                    .catch((e) => {
                        console.log('Error in [handleUpdateListItem]', { e });
                        logError(e);
                        return Promise.reject(e);
                    });
            }
        },
        [updateAllStoreItemsAndItemsWithCost],
    );

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
            setListItemsLoading,
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

export function sortItemsBySection<T extends { store_section: StoreSection; item_name: string }>(
    listItems: T[],
    listOrder?: StoreSection[],
): T[] {
    const sectionOrder = listOrder ?? [
        'Produce',
        'Bulk',
        'Meat/Deli',
        'Dairy/Eggs',
        'Frozen',
        'Toiletries/Paper Products/Cleaning Supplies',
        'Non-perishable',
        'Miscellaneous',
    ];

    // Create a map of section names to their index in the sectionOrder array
    const sectionIndexMap = sectionOrder.reduce(
        (acc, section, index) => {
            acc[section] = index;
            return acc;
        },
        {} as Record<string, number>,
    );

    // Sort the listItems array by section and then by item_name
    return listItems.sort((a, b) => {
        // Sort by section first and then by item_name
        const sectionComparison =
            (sectionIndexMap[a.store_section] ?? Infinity) -
            (sectionIndexMap[b.store_section] ?? Infinity);
        if (sectionComparison !== 0) {
            return sectionComparison;
        }
        return a.item_name.localeCompare(b.item_name);
    });
}
