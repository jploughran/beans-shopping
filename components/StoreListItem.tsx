import { Check } from '@tamagui/lucide-icons';
import { memo, useCallback } from 'react';
import { ListItem, XStack, Checkbox, Label, CheckedState } from 'tamagui';

import { useBottomSheetProviderContext } from '@/context-providers/BottomSheetProvider';
import { useListItemsProviderContext } from '@/context-providers/ListItemsProvider';
import { InitialListItemFormValue } from '@/modules/add-list-item-validation';
import { ListItemWithData } from '@/types/list';

interface Props {
    item: ListItemWithData;
    setItemToEdit: React.Dispatch<React.SetStateAction<InitialListItemFormValue | undefined>>;
}

const StoreListItem = ({ item, setItemToEdit }: Props) => {
    const { handleUpdateListItem } = useListItemsProviderContext();
    const { handleOpenPress } = useBottomSheetProviderContext();

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
                handleOpenPress();
            } else {
                await handleUpdateListItem({
                    ...item,
                    completed: checked,
                } as ListItemWithData);
            }
        },
        [handleOpenPress, handleUpdateListItem, item, setItemToEdit],
    );

    return (
        <ListItem borderRadius="$4" marginTop="$2" paddingHorizontal="$4" paddingVertical="$1">
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
        </ListItem>
    );
};

export default memo(StoreListItem);
