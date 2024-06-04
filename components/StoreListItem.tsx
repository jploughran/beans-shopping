import { Check, GripVertical } from '@tamagui/lucide-icons';
import { memo, useCallback } from 'react';
import { RenderItemParams } from 'react-native-draggable-flatlist';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { ListItem, XStack, Checkbox, Label, CheckedState } from 'tamagui';

import DeleteFromListButton from './DeleteFromListButton';

import { useBottomSheetProviderContext } from '@/context-providers/BottomSheetProvider';
import { useListItemsProviderContext } from '@/context-providers/ListItemsProvider';
import { InitialListItemFormValue } from '@/modules/add-list-item-validation';
import { ListItemWithData } from '@/types/list';

interface Props extends RenderItemParams<ListItemWithData> {
    item: ListItemWithData;
    setItemToEdit: React.Dispatch<React.SetStateAction<InitialListItemFormValue | undefined>>;
}

const StoreListItem = ({ item, setItemToEdit, drag, isActive }: Props) => {
    const { handleUpdateListItem, handleRemoveListItem } = useListItemsProviderContext();
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

    const handleLongPress = useCallback(() => {
        setItemToEdit({
            ...item,
            price: item.price?.toString() ?? '',
            quantity: item.quantity?.toString() ?? '',
        });
        handleOpenPress();
    }, [handleOpenPress, item, setItemToEdit]);

    return (
        <Swipeable
            leftThreshold={20}
            renderRightActions={() => (
                <DeleteFromListButton
                    itemId={item.list_item_id}
                    handleRemoveItem={handleRemoveListItem}
                />
            )}
            containerStyle={{ alignContent: 'center', flex: 1, justifyContent: 'center' }}
        >
            <ListItem borderRadius="$4" marginTop="$2" paddingVertical="$1" paddingHorizontal="$0">
                <XStack
                    alignItems="center"
                    gap="$4"
                    width="100%"
                    paddingRight="$4"
                    backgroundColor={isActive ? '$green4' : '$green2'}
                >
                    <XStack alignItems="center" gap="$2">
                        <XStack onPressIn={drag} paddingHorizontal="$2">
                            <GripVertical color="$green7" size="$1.5" />
                        </XStack>

                        <Checkbox
                            size="$4"
                            checked={item.completed}
                            onCheckedChange={handleChangeChecked}
                        >
                            <Checkbox.Indicator>
                                <Check />
                            </Checkbox.Indicator>
                        </Checkbox>
                    </XStack>
                    <XStack
                        alignItems="center"
                        gap="$4"
                        justifyContent="space-between"
                        flexGrow={1}
                        onPress={handleLongPress}
                        pressStyle={{ backgroundColor: '$green4' }}
                    >
                        <Label onPress={handleLongPress}>{item.item_name}</Label>
                        <Label>
                            {item.price && item.quantity
                                ? `$${(item?.price * item?.quantity).toFixed(2)}`
                                : undefined}
                        </Label>
                    </XStack>
                </XStack>
            </ListItem>
        </Swipeable>
    );
};

export default memo(StoreListItem);
