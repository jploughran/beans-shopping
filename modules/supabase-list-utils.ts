import { supabase } from './supabase';

import {
    ITEMS,
    LISTS,
    LIST_ITEMS,
    List,
    ListItem,
    ListItemWithData,
    StoreItem,
} from '@/types/list';

export const addListToTable = async (storeId: number, listName: string) => {
    const { data, error } = await supabase
        .from(LISTS)
        .insert<Partial<List>>([{ store_id: storeId, list_name: listName }])
        .select();
    if (data) {
        return data[0] as List;
    }
    if (error) {
        console.log('adding list to people', { error });
    }
};

export const addListItem = async (
    storeId: number,
    itemName: string,
    listId: number,
): Promise<ListItemWithData> => {
    return handleSupabaseInsertRow<StoreItem>({ store_id: storeId, item_name: itemName }, ITEMS)
        .then(async (itemAddedToStore) => {
            return handleSupabaseInsertRow<ListItem>(
                { list_id: listId, item_id: itemAddedToStore.item_id },
                LIST_ITEMS,
            )
                .then((listItem) => {
                    return { ...itemAddedToStore, ...listItem };
                })
                .catch((e) => Promise.reject(e));
        })
        .catch((e) => Promise.reject(e));
};

export async function handleSupabaseInsertRow<T>(
    data: Partial<T>,
    tableToUpdate: string,
): Promise<T> {
    const { data: data_1, error } = await supabase
        .from(tableToUpdate)
        .insert<Partial<T>>([{ ...data }])
        .select();
    if (data_1?.[0]) {
        const itemAdded = data_1[0] as T;
        return Promise.resolve(itemAdded);
    } else {
        console.log('error in handleSupabaseInsertRow', { error });
        return Promise.reject(error);
    }
}

export async function handleRemoveSupabaseRow<T>(
    idKey: keyof T,
    dataId: string | number,
    tableToUpdate: string,
): Promise<void> {
    return supabase
        .from(tableToUpdate)
        .delete()
        .eq(idKey.toString(), dataId)
        .then(({ error }) => (error ? Promise.reject(error) : Promise.resolve()));
}

export const getListItemsWithData = async (listId: number) => {
    return supabase
        .from(LIST_ITEMS)
        .select(
            `quantity, list_id, created_at, item_id, list_item_id, user_id, items(item_name, price, price_type, store_id, description)`,
        )
        .eq('list_id', listId)
        .then(({ data, error }) => {
            const transformedData = data?.reduce((transformedData, current) => {
                const dataToAdd: ListItemWithData = { ...current, ...current.items[0] };
                transformedData.push(dataToAdd);
                return transformedData;
            }, [] as ListItemWithData[]);
            return transformedData
                ? Promise.resolve(transformedData as ListItemWithData[])
                : Promise.reject(error);
        });
};
