import { InitialListItemFormValue } from './add-list-item-validation';
import { supabase } from './supabase';

import { ItemFormInitialValues } from '@/components/AddStoreItemForm';
import {
    ITEMS,
    LISTS,
    LIST_ITEMS,
    List,
    ListItem,
    ListItemWithData,
    Store,
    StoreItem,
} from '@/types/list';
import { Database, ExistingTables, InsertType, RowType } from '@/types/supabase';
import { breadcrumb, logError } from '@/utils/logging';
import { SetStateAction } from 'react';

export const addListToTable = async (storeId: number, listName: string) => {
    breadcrumb(`[addListToTable]`, 'supabase-utils', { storeId, listName });

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
    breadcrumb(`[updateListItem]`, 'supabase-utils', { itemData });

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
    return handleSupabaseInsertRow(
        {
            store_id,
            item_name,
            price: parseFloat(price ?? '0'),
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
                    quantity: parseFloat(quantity ?? '1'),
                    user_id,
                    list_order,
                    completed,
                },
                LIST_ITEMS,
            )
                .then((listItem) => {
                    return { ...itemAddedToStore, ...listItem };
                })
                .catch((e) => {
                    logError(e, 1);
                    return Promise.reject(e);
                });
        })
        .catch((e) => {
            logError(e, 1);
            return Promise.reject(e);
        });
};

export const addStoreItem = async (itemData: ItemFormInitialValues): Promise<StoreItem> => {
    breadcrumb(`[addStoreItem]`, 'supabase-utils', { itemData });

    try {
        const { store_id, item_name, price, price_type, item_id, store_section } = itemData;

        return handleSupabaseInsertRow(
            {
                store_id,
                item_name,
                price: parseFloat(`${price}` ?? '0'),
                price_type,
                item_id,
                store_section,
            },
            ITEMS,
        ).then(async (itemAddedToStore) => {
            return itemAddedToStore;
        });
    } catch (error) {
        logError(error, 1);
        return Promise.reject(error);
    }
};

export async function handleSupabaseInsertRow<T extends ExistingTables>(
    data: InsertType<T>,
    tableToUpdate: T,
): Promise<RowType<T>> {
    breadcrumb(`[handleSupabaseInsertRow]`, 'supabase-utils', { data, tableToUpdate });
    const { data: data_1, error } = await supabase
        .from(tableToUpdate)
        .upsert({ ...data })
        .select();
    if (data_1?.[0]) {
        const itemAdded = data_1[0];
        return Promise.resolve(itemAdded);
    } else {
        logError(error, 1);

        console.log('error in handleSupabaseInsertRow', { error });
        return Promise.reject(error);
    }
}

export async function removeListItemsForListId(listId: number) {
    breadcrumb(`[removeListItemsForListId]`, 'supabase-utils', { listId });

    return supabase
        .from('list_items')
        .delete()
        .in('list_id', [listId])
        .then(({ error }) => {
            if (error) {
                logError(error, 1);
                return Promise.reject(error);
            } else {
                return Promise.resolve();
            }
        });
}

export async function handleRemoveSupabaseRow<T>(
    idKey: keyof T,
    dataId: string | number,
    tableToUpdate: keyof Database['public']['Tables'],
): Promise<void> {
    breadcrumb(`[handleRemoveSupabaseRow]`, 'supabase-utils', { idKey, dataId, tableToUpdate });

    return supabase
        .from(tableToUpdate)
        .delete()
        .eq(idKey.toString(), dataId)
        .then(({ error }) => {
            if (error) {
                logError(error, 1);
                return Promise.reject(error);
            } else {
                return Promise.resolve();
            }
        });
}

export async function handleUpdateSupabaseRow<T extends ExistingTables>(
    data: InsertType<T>,
    idKey: keyof InsertType<T>,
    dataId: string | number,
    tableToUpdate: T,
) {
    breadcrumb(`[handleUpdateSupabaseRow]`, 'supabase-utils', {
        data,
        idKey,
        dataId,
        tableToUpdate,
    });

    return supabase
        .from(tableToUpdate)
        .update({ ...data })
        .eq(idKey.toString(), dataId)
        .select()
        .then(({ data, error }) => {
            if (error) {
                logError(error, 1);
                return Promise.reject(error);
            } else {
                return Promise.resolve(data[0]);
            }
        });
}

export const getStores = async () => {
    breadcrumb(`[getStores]`, 'supabase-utils', {});

    return supabase
        .from('stores')
        .select(`*`)
        .then(async ({ data, error }) => {
            if (data) {
                return Promise.resolve(data as Store[]);
            } else {
                logError(error, 1);
                return Promise.reject(error);
            }
        });
};

export const getListItemsWithData = async (listId: number, user_id: string) => {
    breadcrumb(`[getListItemsWithData]`, 'supabase-utils', { listId, user_id });

    return supabase
        .from('list_items_with_store_data')
        .select(`*`)
        .eq('list_id', listId)
        .eq('user_id', user_id)
        .then(async ({ data, error }) => {
            if (data) {
                return Promise.resolve(data as ListItemWithData[]);
            } else {
                logError(error, 1);
                return Promise.reject(error);
            }
        });
};

/**
 * Subscribes to changes in the list_items table for the given store ID and user ID.
 * @param storeId The ID of the store to subscribe to.
 * @param user_id The user ID of the user who owns the store.
 * @param getListItems A function that fetches list items for a given list ID and user ID.
 * @returns A channel object that can be used to unsubscribe from the subscription.
 */

export const subscribeToListItemsForStore = (
    storeId: number,
    user_id: string,
    getListItems: (listId: number, user_id: string, setLoading?: boolean) => Promise<void>,
) => {
    breadcrumb(`[subscribeToListItemsForStore]`, 'supabase-utils', { storeId, user_id });
    return supabase
        .channel('custom-filter-channel')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'list_items',
                filter: `user_id=eq.${user_id}`,
            },
            async (payload) => {
                const { list_id } = payload.new as ListItem;
                await getListItems(list_id, user_id, false);
            },
        )
        .subscribe();
};

export const getListItemsForStore = async (storeId: number, user_id: string) => {
    breadcrumb(`[getListItemsForStore]`, 'supabase-utils', { storeId, user_id });

    return supabase
        .from('list_items_with_store_data')
        .select(`*`)
        .eq('store_id', storeId)
        .eq('user_id', user_id)
        .then(async ({ data, error }) => {
            if (data) {
                return Promise.resolve(data as ListItemWithData[]);
            } else {
                logError(error, 1);
                return Promise.reject(error);
            }
        });
};

export const getItemsForStores = async () => {
    breadcrumb(`[getItemsForStores]`, 'supabase-utils', {});

    return supabase
        .from('items')
        .select(`*`)
        .then(async ({ data, error }) => {
            if (data) {
                return Promise.resolve(data as StoreItem[]);
            } else {
                logError(error, 1);
                return Promise.reject(error);
            }
        });
};

export async function handleSupabaseUpsert<T extends ExistingTables>(
    data: Partial<InsertType<T>>[],
    tableToUpdate: T,
) {
    breadcrumb(`[handleSupabaseUpsert]`, 'supabase-utils', { data, tableToUpdate });

    return supabase
        .from(tableToUpdate)
        .upsert(data)
        .select()
        .then((e) => {
            console.log('response [handleSupabaseUpsert]', { e, data: e.data });
        });
}
