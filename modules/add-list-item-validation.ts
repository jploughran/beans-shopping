import * as Yup from 'yup';

import { ListCreationType } from '@/components/AddListForm';
import { ItemFormInitialValues } from '@/components/AddStoreItemForm';
import { ListItemWithData, STORE_SECTIONS, StoreSection } from '@/types/list';

export interface InitialListItemFormValue
    extends Omit<ListItemWithData, 'item_id' | 'list_item_id' | 'quantity' | 'price'> {
    list_item_id?: number;
    item_id?: number;
    quantity?: string;
    price?: string;
}

export const newListItemValidationSchema: Yup.ObjectSchema<InitialListItemFormValue> = Yup.object({
    completed: Yup.boolean().required(),
    created_at: Yup.string().required(),
    list_order: Yup.number().label('List Item ID').required(),
    list_id: Yup.number().label('List ID').required('List ID required'),
    list_item_id: Yup.number().label('List Item ID'),
    item_id: Yup.number().label('Store Item ID'),
    store_id: Yup.number().label('Store ID').required('Store ID required'),
    quantity: Yup.string().label('Quantity'),
    price: Yup.string().label('Price'),
    price_type: Yup.string().oneOf(['count', 'weight']).label('Price Type'),
    item_name: Yup.string().label('Item Name').required('A name is required'),
    user_id: Yup.string().label('User ID').required('A user ID is required'),
    store_section: Yup.string<StoreSection>()
        .label('Store section')
        .required('A store section is required')
        .oneOf(STORE_SECTIONS),
});

export const newListValidationSchema: Yup.ObjectSchema<ListCreationType> = Yup.object({
    created_at: Yup.string().required(),
    store_id: Yup.number().label('Store ID').required('Store ID required'),
    list_name: Yup.string().label('List Name').required('A name is required'),
});

export const newStoreItemValidationSchema: Yup.ObjectSchema<ItemFormInitialValues> = Yup.object({
    created_at: Yup.string(),
    user_id: Yup.string(),
    item_id: Yup.number().label('Store Item ID'),
    store_id: Yup.number().label('Store ID').required('Store ID required'),
    price: Yup.number().label('Price'),
    price_type: Yup.string().oneOf(['count', 'weight']).label('Price Type').nullable(),
    item_name: Yup.string().label('Item Name').required('A name is required'),
    store_section: Yup.string()
        .label('Store section')
        .required('A store section is required')
        .oneOf(STORE_SECTIONS),
});
