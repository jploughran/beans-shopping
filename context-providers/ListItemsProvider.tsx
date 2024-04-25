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
} from '@/modules/supabase-list-utils';
import { LIST_ITEMS, ListItem, ListItemWithData } from '@/types/list';

export interface ListItemsProviderContextValues {
    handleAddListItem: (
        itemToAdd: Pick<ListItemWithData, 'store_id' | 'item_name' | 'list_id'>,
    ) => Promise<void>;
    handleRemoveListItem: (itemToRemoveId: number) => Promise<void>;
    itemsWithCost: ListItemWithData[];
    setItemsWithCost: Dispatch<SetStateAction<ListItemWithData[]>>;
}

export const ListItemsProviderContext = createContext<ListItemsProviderContextValues | null>(null);

export const ListItemsProvider = ({
    children,
}: Record<string, unknown> & {
    children?: React.ReactNode;
}) => {
    const [itemsWithCost, setItemsWithCost] = useState<ListItemWithData[]>([]);
    const listId = useSelectedList()?.list_id;
    console.log({ itemsWithCost });
    useEffect(() => {
        if (listId) {
            const getListItems = async () => {
                await getListItemsWithData(listId)
                    .then((listItems) => setItemsWithCost(listItems))
                    .catch((e) => console.error(e));
            };
            getListItems();
        }
    }, [listId]);

    const handleAddListItem = useCallback(
        async (itemToAdd: Pick<ListItemWithData, 'store_id' | 'item_name' | 'list_id'>) => {
            addListItem(itemToAdd.store_id, itemToAdd.item_name, itemToAdd.list_id);
        },
        [],
    );

    const handleRemoveListItem = useCallback(async (itemToRemoveId: number) => {
        handleRemoveSupabaseRow<ListItem>('list_item_id', itemToRemoveId, LIST_ITEMS).then(() => {
            setItemsWithCost((prev) =>
                prev.filter(({ list_item_id }) => list_item_id !== itemToRemoveId),
            );
        });
    }, []);

    const contextValue: ListItemsProviderContextValues = useMemo(() => {
        return {
            handleAddListItem,
            itemsWithCost,
            setItemsWithCost,
            handleRemoveListItem,
        };
    }, [handleAddListItem, handleRemoveListItem, itemsWithCost]);

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
