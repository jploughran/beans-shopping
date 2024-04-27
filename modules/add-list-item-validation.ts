import * as Yup from 'yup';

import { ListItemWithData } from '@/types/list';

export interface InitialListItemFormValue
    extends Omit<ListItemWithData, 'item_id' | 'list_item_id' | 'quantity' | 'price'> {
    list_item_id?: number;
    item_id?: number;
    quantity: string;
    price: string;
}

export const newListItemValidationSchema: Yup.ObjectSchema<InitialListItemFormValue> = Yup.object({
    completed: Yup.boolean().required(),
    created_at: Yup.string().required(),
    list_id: Yup.number().label('List ID').required('List ID required'),
    list_item_id: Yup.number().label('List Item ID'),
    item_id: Yup.number().label('Store Item ID'),
    store_id: Yup.number().label('Store ID').required('Store ID required'),
    description: Yup.string().label('Description').nullable(),
    quantity: Yup.string().label('Quantity').required('Quantity required'),
    price: Yup.string().label('Price').required('Price required'),
    price_type: Yup.string().oneOf(['count', 'weight']).label('Price Type'),
    item_name: Yup.string().label('Item Name').required('A name is required'),
    user_id: Yup.string().label('User sID').required('A user ID is required'),
});
