import { Check, Component, MoreVertical, Trash } from '@tamagui/lucide-icons';
import { memo, useCallback, useState } from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { ListItem, XStack, Checkbox, Label, CheckedState, Button } from 'tamagui';

import LoadingView from './LoadingView';

import { useBottomSheetProviderContext } from '@/context-providers/BottomSheetProvider';
import { useListItemsProviderContext } from '@/context-providers/ListItemsProvider';
import { InitialListItemFormValue } from '@/modules/add-list-item-validation';
import { ListItemWithData } from '@/types/list';
import { RenderItemParams } from 'react-native-draggable-flatlist';

interface Props extends RenderItemParams<ListItemWithData> {
    item: ListItemWithData;
    setItemToEdit: React.Dispatch<React.SetStateAction<InitialListItemFormValue | undefined>>;
}

const StoreListItem = ({ item, setItemToEdit, drag, isActive }: Props) => {
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
            renderRightActions={() => <DeleteButton itemId={item.list_item_id} />}
            containerStyle={{ alignContent: 'center', flex: 1, justifyContent: 'center' }}
        >
            <ListItem borderRadius="$4" marginTop="$2" paddingVertical="$1" paddingHorizontal="$0">
                <XStack alignItems="center" gap="$4" width="100%" paddingRight="$4">
                    <XStack alignItems="center" gap="$2">
                        <MoreVertical paddingRight="$2" color="$green8" onLongPress={drag} />
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
                        onLongPress={handleLongPress}
                        pressStyle={{ backgroundColor: '$green4' }}
                    >
                        <Label onLongPress={handleLongPress}>{item.item_name}</Label>
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

const DeleteButton = ({ itemId }: { itemId: number }) => {
    const { handleRemoveListItem } = useListItemsProviderContext();
    const [loading, setLoading] = useState(false);

    const handleDelete = useCallback(async () => {
        setLoading(true);
        await handleRemoveListItem(itemId).finally(() => setLoading(false));
    }, [handleRemoveListItem, itemId]);

    return (
        <LoadingView message="" loading={loading}>
            <Button
                alignSelf="center"
                icon={<Trash color="$red10" />}
                onPress={handleDelete}
                padding="$3"
                chromeless
            />
        </LoadingView>
    );
};
