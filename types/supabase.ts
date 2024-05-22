export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
    public: {
        Tables: {
            items: {
                Row: {
                    created_at: string | null;
                    item_id: number;
                    item_name: string;
                    price: number | null;
                    price_type: Database['public']['Enums']['price_type'] | null;
                    store_id: number;
                    user_id: string;
                };
                Insert: {
                    created_at?: string | null;
                    item_id?: number;
                    item_name: string;
                    price?: number | null;
                    price_type?: Database['public']['Enums']['price_type'] | null;
                    store_id: number;
                    user_id?: string;
                };
                Update: {
                    created_at?: string | null;
                    item_id?: number;
                    item_name?: string;
                    price?: number | null;
                    price_type?: Database['public']['Enums']['price_type'] | null;
                    store_id?: number;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'items_store_id_fkey';
                        columns: ['store_id'];
                        isOneToOne: false;
                        referencedRelation: 'stores';
                        referencedColumns: ['store_id'];
                    },
                    {
                        foreignKeyName: 'public_items_user_id_fkey';
                        columns: ['user_id'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            list_items: {
                Row: {
                    completed: boolean;
                    created_at: string | null;
                    item_id: number;
                    list_id: number;
                    list_item_id: number;
                    list_order: number;
                    quantity: number | null;
                    user_id: string | null;
                };
                Insert: {
                    completed?: boolean;
                    created_at?: string | null;
                    item_id: number;
                    list_id: number;
                    list_item_id?: number;
                    list_order?: number;
                    quantity?: number | null;
                    user_id?: string | null;
                };
                Update: {
                    completed?: boolean;
                    created_at?: string | null;
                    item_id?: number;
                    list_id?: number;
                    list_item_id?: number;
                    list_order?: number;
                    quantity?: number | null;
                    user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'listitems_item_id_fkey';
                        columns: ['item_id'];
                        isOneToOne: false;
                        referencedRelation: 'items';
                        referencedColumns: ['item_id'];
                    },
                    {
                        foreignKeyName: 'listitems_item_id_fkey';
                        columns: ['item_id'];
                        isOneToOne: false;
                        referencedRelation: 'list_items_with_store_data';
                        referencedColumns: ['item_id'];
                    },
                    {
                        foreignKeyName: 'listitems_list_id_fkey';
                        columns: ['list_id'];
                        isOneToOne: false;
                        referencedRelation: 'lists';
                        referencedColumns: ['list_id'];
                    },
                    {
                        foreignKeyName: 'public_listitems_user_id_fkey';
                        columns: ['user_id'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            lists: {
                Row: {
                    completed: boolean;
                    created_at: string | null;
                    list_id: number;
                    list_name: string;
                    store_id: number;
                    total_cost: number | null;
                    user_id: string;
                };
                Insert: {
                    completed?: boolean;
                    created_at?: string | null;
                    list_id?: number;
                    list_name: string;
                    store_id: number;
                    total_cost?: number | null;
                    user_id?: string;
                };
                Update: {
                    completed?: boolean;
                    created_at?: string | null;
                    list_id?: number;
                    list_name?: string;
                    store_id?: number;
                    total_cost?: number | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'lists_store_id_fkey';
                        columns: ['store_id'];
                        isOneToOne: false;
                        referencedRelation: 'stores';
                        referencedColumns: ['store_id'];
                    },
                    {
                        foreignKeyName: 'public_lists_user_id_fkey';
                        columns: ['user_id'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            Recipes: {
                Row: {
                    created_at: string;
                    id: number;
                    item_ids: number[] | null;
                    name: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: number;
                    item_ids?: number[] | null;
                    name: string;
                    user_id?: string;
                };
                Update: {
                    created_at?: string;
                    id?: number;
                    item_ids?: number[] | null;
                    name?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            stores: {
                Row: {
                    created_at: string | null;
                    location: string | null;
                    store_id: number;
                    storename: string;
                };
                Insert: {
                    created_at?: string | null;
                    location?: string | null;
                    store_id?: number;
                    storename: string;
                };
                Update: {
                    created_at?: string | null;
                    location?: string | null;
                    store_id?: number;
                    storename?: string;
                };
                Relationships: [];
            };
        };
        Views: {
            list_items_with_store_data: {
                Row: {
                    completed: boolean | null;
                    created_at: string | null;
                    item_id: number | null;
                    item_name: string | null;
                    list_id: number | null;
                    list_item_id: number | null;
                    price: number | null;
                    price_type: Database['public']['Enums']['price_type'] | null;
                    quantity: number | null;
                    store_id: number | null;
                    user_id: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'items_store_id_fkey';
                        columns: ['store_id'];
                        isOneToOne: false;
                        referencedRelation: 'stores';
                        referencedColumns: ['store_id'];
                    },
                    {
                        foreignKeyName: 'listitems_list_id_fkey';
                        columns: ['list_id'];
                        isOneToOne: false;
                        referencedRelation: 'lists';
                        referencedColumns: ['list_id'];
                    },
                    {
                        foreignKeyName: 'public_listitems_user_id_fkey';
                        columns: ['user_id'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            price_type: 'weight' | 'count';
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
    PublicTableNameOrOptions extends
        | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
              Database[PublicTableNameOrOptions['schema']]['Views'])
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
          Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
      ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
            Row: infer R;
        }
          ? R
          : never
      : never;

export type TablesInsert<
    PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
      ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
            Insert: infer I;
        }
          ? I
          : never
      : never;

export type TablesUpdate<
    PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
      ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
            Update: infer U;
        }
          ? U
          : never
      : never;

export type Enums<
    PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
        : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
      ? PublicSchema['Enums'][PublicEnumNameOrOptions]
      : never;

export type ExistingTables = keyof Database['public']['Tables'];

export type EntityBase<T extends ExistingTables> = Database['public']['Tables'][T];

export type RowType<T extends ExistingTables> = EntityBase<T>['Row'];
export type InsertType<T extends ExistingTables> = EntityBase<T>['Insert'];
export type UpdateType<T extends ExistingTables> = EntityBase<T>['Update'];
