import { Check } from '@tamagui/lucide-icons';
import { memo, useCallback, useState } from 'react';
import { ListItem, XStack, Checkbox, Label, CheckedState } from 'tamagui';

import { AddListItemForm } from './AddListItemForm';

import { useListItemsProviderContext } from '@/context-providers/ListItemsProvider';
import { InitialListItemFormValue } from '@/modules/add-list-item-validation';
import { ListItemWithData } from '@/types/list';

interface Props {
    item: ListItemWithData;
}

const StoreListItem = ({ item }: Props) => {
    const { handleUpdateListItem } = useListItemsProviderContext();
    const [openForm, setOpenForm] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<InitialListItemFormValue>();

    const handleSubmit = useCallback(
        async (formValues: InitialListItemFormValue) => {
            const valuesToSubmit = {
                ...formValues,
                description: '',
                price: parseFloat(formValues.price),
                quantity: parseFloat(formValues.quantity),
            } as ListItemWithData;
            console.log(`handleSubmit called`, { valuesToSubmit });
            await handleUpdateListItem(valuesToSubmit);
        },
        [handleUpdateListItem],
    );

    const handleChangeChecked = useCallback(
        async (checked: CheckedState) => {
            if (checked) {
                console.log({ checked, itemToUpdate: item });
                setItemToEdit({
                    ...item,
                    completed: !!checked,
                    price: item.price?.toString() ?? '',
                    quantity: item.quantity?.toString() ?? '',
                });
                setOpenForm(true);
            } else {
                await handleUpdateListItem({
                    ...item,
                    completed: checked,
                } as ListItemWithData);
            }
        },
        [handleUpdateListItem, item],
    );

    return (
        <ListItem
            borderRadius="$4"
            marginTop="$2"
            paddingHorizontal="$4"
            paddingVertical="$1"
            key={item.list_item_id + item.item_name}
        >
            <XStack alignItems="center" gap="$4" justifyContent="space-between" width="100%">
                <Checkbox size="$4" checked={item.completed} onCheckedChange={handleChangeChecked}>
                    <Checkbox.Indicator>
                        <Check />
                    </Checkbox.Indicator>
                </Checkbox>
                <Label>{item.item_name}</Label>
                <Label>
                    {item.price && item.quantity
                        ? `$${(item?.price * item?.quantity).toFixed(2)}`
                        : undefined}
                </Label>
            </XStack>
            {openForm ? (
                <AddListItemForm
                    setOpenForm={setOpenForm}
                    itemToEdit={itemToEdit}
                    handleFormSubmit={handleSubmit}
                />
            ) : null}
        </ListItem>
    );
};

export default memo(StoreListItem);
