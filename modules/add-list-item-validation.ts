import * as Yup from 'yup';

import { ListCreationType } from '@/components/AddListForm';
import { ListItemWithData } from '@/types/list';

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
    list_id: Yup.number().label('List ID').required('List ID required'),
    list_item_id: Yup.number().label('List Item ID'),
    item_id: Yup.number().label('Store Item ID'),
    store_id: Yup.number().label('Store ID').required('Store ID required'),
    quantity: Yup.string().label('Quantity'),
    price: Yup.string().label('Price'),
    price_type: Yup.string().oneOf(['count', 'weight']).label('Price Type'),
    item_name: Yup.string().label('Item Name').required('A name is required'),
    user_id: Yup.string().label('User sID').required('A user ID is required'),
});

// const initialValues: ListCreationType = {
//     created_at: new Date(Date.now()).toLocaleString(),
//     completed: false,
//     list_name: '',
//     store_id: 0,
//     total_cost: null,
// };

export const newListValidationSchema: Yup.ObjectSchema<ListCreationType> = Yup.object({
    created_at: Yup.string().required(),
    store_id: Yup.number().label('Store ID').required('Store ID required'),
    list_name: Yup.string().label('List Name').required('A name is required'),
});
