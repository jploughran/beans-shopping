import { InitialListItemFormValue } from './add-list-item-validation';
import { supabase } from './supabase';

import { ItemFormInitialValues } from '@/components/AddStoreItemForm';
import { ITEMS, LISTS, LIST_ITEMS, List, ListItemWithData, Store, StoreItem } from '@/types/list';
import { Database, ExistingTables, InsertType, RowType } from '@/types/supabase';

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

export const updateListItem = async (
    itemData: InitialListItemFormValue,
): Promise<ListItemWithData> => {
    const {
        store_id,
        item_name,
        price,
        price_type,
        list_id,
        quantity,
        user_id,
        item_id,
        list_order,
        store_section,
        list_item_id,
        completed,
    } = itemData;
    console.log('store section in addListItem', { store_section });
    return handleSupabaseInsertRow(
        {
            store_id,
            item_name,
            price: parseFloat(price),
            price_type,
            user_id,
            item_id,
            store_section,
        },
        ITEMS,
    )
        .then(async (itemAddedToStore) => {
            return handleSupabaseInsertRow(
                {
                    list_item_id,
                    list_id,
                    item_id: itemAddedToStore.item_id,
                    quantity: parseFloat(quantity),
                    user_id,
                    list_order,
                    completed,
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

export const addStoreItem = async (itemData: ItemFormInitialValues): Promise<StoreItem> => {
    try {
        const { store_id, item_name, price, price_type, item_id } = itemData;

        return handleSupabaseInsertRow(
            {
                store_id,
                item_name,
                price: parseFloat(`${price}` ?? '0'),
                price_type,
                item_id,
            },
            ITEMS,
        ).then(async (itemAddedToStore) => {
            return itemAddedToStore;
        });
    } catch (error) {
        return Promise.reject(error);
    }
};

export async function handleSupabaseInsertRow<T extends ExistingTables>(
    data: InsertType<T>,
    tableToUpdate: T,
): Promise<RowType<T>> {
    const { data: data_1, error } = await supabase
        .from(tableToUpdate)
        .upsert({ ...data })
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
    console.log({ data, idKey, dataId, tableToUpdate });
    return supabase
        .from(tableToUpdate)
        .update({ ...data })
        .eq(idKey.toString(), dataId)
        .select()
        .then(({ data, error }) => {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve(data[0]);
            }
        });
}

export const getStores = async () => {
    return supabase
        .from('stores')
        .select(`*`)
        .then(({ data, error }) => {
            return data ? Promise.resolve(data as Store[]) : Promise.reject(error);
        });
};

export const getListItemsWithData = async (listId: number, user_id: string) => {
    return supabase
        .from('list_items_with_store_data')
        .select(`*`)
        .eq('list_id', listId)
        .eq('user_id', user_id)
        .then(({ data, error }) => {
            return data ? Promise.resolve(data as ListItemWithData[]) : Promise.reject(error);
        });
};

export const getListItemsForStore = async (storeId: number, user_id: string) => {
    return supabase
        .from('list_items_with_store_data')
        .select(`*`)
        .eq('store_id', storeId)
        .eq('user_id', user_id)
        .then(({ data, error }) => {
            return data ? Promise.resolve(data as ListItemWithData[]) : Promise.reject(error);
        });
};

export const getItemsForStores = async () => {
    return supabase
        .from('items')
        .select(`*`)
        .then(({ data, error }) => {
            return data ? Promise.resolve(data as StoreItem[]) : Promise.reject(error);
        });
};

export async function handleSupabaseUpsert<T extends ExistingTables>(
    data: Partial<InsertType<T>>[],
    tableToUpdate: T,
) {
    return supabase
        .from(tableToUpdate)
        .upsert(data)
        .select()
        .then((e) => {
            console.log('response [handleSupabaseUpsert]', { e, data: e.data });
        });
}
