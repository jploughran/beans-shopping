import { InitialListItemFormValue } from './add-list-item-validation';
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
import { Database, ExistingTables, InsertType, RowType, Tables } from '@/types/supabase-types';

export const addListToTable = async (storeId: number, listName: string) => {
    const { data, error } = await supabase
        .from(LISTS)
        .insert([{ store_id: storeId, list_name: listName }])
        .select();
    if (data) {
        return data[0] as List;
    }
    if (error) {
        console.log('adding list to people', { error });
    }
};

export const addListItem = async (
    itemData: InitialListItemFormValue,
): Promise<ListItemWithData> => {
    const { store_id, item_name, price, price_type, list_id, quantity, user_id } = itemData;
    return handleSupabaseInsertRow(
        { store_id, item_name, price: parseFloat(price), price_type, user_id },
        ITEMS,
    )
        .then(async (itemAddedToStore) => {
            return handleSupabaseInsertRow(
                {
                    list_id,
                    item_id: itemAddedToStore.item_id,
                    quantity: parseFloat(quantity),
                    user_id,
                },
                LIST_ITEMS,
            )
                .then((listItem) => {
                    return { ...itemAddedToStore, ...listItem };
                })
                .catch((e) => Promise.reject(e));
        })
        .catch((e) => Promise.reject(e));
};

export async function handleSupabaseInsertRow<T extends ExistingTables>(
    data: InsertType<T>,
    tableToUpdate: T,
) {
    const { data: data_1, error } = await supabase
        .from(tableToUpdate)
        .insert([{ ...data }])
        .select();
    if (data_1?.[0]) {
        const itemAdded = data_1[0];
        return Promise.resolve(itemAdded);
    } else {
        console.log('error in handleSupabaseInsertRow', { error });
        return Promise.reject(error);
    }
}

export async function handleRemoveSupabaseRow<T>(
    idKey: keyof T,
    dataId: string | number,
    tableToUpdate: keyof Database['public']['Tables'],
): Promise<void> {
    return supabase
        .from(tableToUpdate)
        .delete()
        .eq(idKey.toString(), dataId)
        .then(({ error }) => (error ? Promise.reject(error) : Promise.resolve()));
}

export async function handleUpdateSupabaseRow<T extends ExistingTables>(
    data: InsertType<T>,
    idKey: keyof InsertType<T>,
    dataId: string | number,
    tableToUpdate: T,
) {
    return supabase
        .from(tableToUpdate)
        .update({ ...data })
        .eq(idKey.toString(), dataId)
        .select()
        .then(({ data, error }) => (error ? Promise.reject(error) : Promise.resolve(data[0])));
}

export const getListItemsWithData = async (listId: number) => {
    return supabase
        .from('list_items_with_store_data')
        .select(`*`)
        .eq('list_id', listId)
        .then(({ data, error }) => {
            return data ? Promise.resolve(data as ListItemWithData[]) : Promise.reject(error);
        });
};

export const updateListItem = async (itemData: ListItemWithData) => {
    const {
        store_id,
        item_name,
        price,
        price_type,
        list_id,
        quantity,
        user_id,
        list_item_id,
        item_id,
        completed,
    } = itemData;
    return handleUpdateSupabaseRow(
        { store_id, item_name, price, price_type, user_id, item_id },
        'item_id',
        item_id ?? '',
        ITEMS,
    )
        .then(async (itemAddedToStore) => {
            return handleUpdateSupabaseRow(
                {
                    list_id,
                    item_id: itemAddedToStore.item_id,
                    quantity,
                    user_id,
                    list_item_id,
                    completed,
                },
                'list_item_id',
                list_item_id ?? '',
                LIST_ITEMS,
            )
                .then((listItem) => {
                    console.log('updateListItem returns', { ...itemAddedToStore, ...listItem });
                    return Promise.resolve({
                        ...itemAddedToStore,
                        ...listItem,
                    } as ListItemWithData);
                })
                .catch((e) => Promise.reject(e));
        })
        .catch((e) => Promise.reject(e));
};
