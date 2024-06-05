import { RowType, Database } from './supabase';

export interface List {
    completed: boolean;
    created_at: string;
    list_id: number;
    list_name: string;
    store_id: number;
    total_cost?: number;
    user_id: string;
}

export interface Store extends RowType<'stores'> {}
export interface StoreItem extends RowType<'items'> {}
export interface ListItem extends RowType<'list_items'> {}

export interface ListItemWithData extends ListItem, StoreItem {
    user_id: string;
}

export interface Recipe {
    id: string;
    items: ListItem[];
    estimatedCost?: number;
    name: string;
    userId: string;
}

export type StoreSection = Database['public']['Enums']['store_location'];

export const STORE_SECTIONS: StoreSection[] = [
    'Produce',
    'Bulk',
    'Meat/Deli',
    'Dairy/Eggs',
    'Frozen',
    'Toiletries/Paper Products/Cleaning Supplies',
    'Non-perishable',
    'Miscellaneous',
];

export const LISTS = 'lists';
export const RECIPES = 'recipes';
export const LIST_ITEMS = 'list_items';
export const ITEMS = 'items';
export const ITEM_PRICE_TYPES = 'item_price_types';

export const USER_ITEMS_WITH_COST = 'ItemsWithCost';
