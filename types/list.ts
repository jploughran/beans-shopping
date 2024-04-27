export interface List {
    completed: boolean;
    created_at: string;
    list_id: number;
    list_name: string;
    store_id: number;
    total_cost?: number;
    user_id: string;
}

export interface ListItemWithData extends ListItem, StoreItem {}

export interface ListItem {
    completed: boolean;
    created_at: string | null;
    item_id: number;
    list_item_id: number;
    list_id: number;
    quantity?: number;
    user_id: string;
}

export interface StoreItem {
    created_at: string | null;
    description?: string | null;
    item_id: number;
    item_name: string;
    price?: number;
    price_type?: 'count' | 'weight';
    store_id: number;
    user_id: string;
}

export interface Recipe {
    id: string;
    items: ListItem[];
    estimatedCost?: number;
    name: string;
    userId: string;
}

export enum PriceType {
    WEIGHT = 1,
    COUNT = 2,
}

export const LISTS = 'lists';
export const RECIPES = 'recipes';
export const LIST_ITEMS = 'list_items';
export const ITEMS = 'items';
export const ITEM_PRICE_TYPES = 'item_price_types';

export const USER_ITEMS_WITH_COST = 'ItemsWithCost';
