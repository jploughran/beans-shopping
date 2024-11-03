import { memo, useCallback } from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { ListItem, XStack, Label, Theme, ThemeName } from 'tamagui';

import DeleteFromListButton from './DeleteFromListButton';

import { useBottomSheetProviderContext } from '@/context-providers/BottomSheetProvider';
import { useStoreItemProviderContext } from '@/context-providers/StoreItemsProvider';
import { StoreItem, StoreSection } from '@/types/list';

interface Props {
    item: StoreItem;
    setItemToEdit: React.Dispatch<React.SetStateAction<StoreItem | undefined>>;
}

const StoreItemRow = ({ item, setItemToEdit }: Props) => {
    const { handleRemoveStoreItem } = useStoreItemProviderContext();
    const { handleOpenPress } = useBottomSheetProviderContext();

    const handleLongPress = useCallback(() => {
        setItemToEdit({
            ...item,
            price: item.price?.toString() ?? '',
        });
        handleOpenPress();
    }, [handleOpenPress, item, setItemToEdit]);

    return (
        <Swipeable
            leftThreshold={20}
            renderRightActions={() => (
                <DeleteFromListButton
                    itemId={item.item_id}
                    handleRemoveItem={handleRemoveStoreItem}
                />
            )}
            containerStyle={{ alignContent: 'center', flex: 1, justifyContent: 'center' }}
        >
            <Theme name={sectionColorDictionary[item.store_section]}>
                <ListItem
                    borderRadius="$4"
                    marginTop="$2"
                    paddingVertical="$1"
                    paddingHorizontal="$0"
                >
                    <XStack
                        alignItems="center"
                        gap="$4"
                        width="100%"
                        paddingHorizontal="$3"
                        backgroundColor={'$' + sectionColorDictionary[item.store_section] + '3'}
                    >
                        <XStack
                            paddingHorizontal="$2"
                            alignItems="center"
                            gap="$4"
                            justifyContent="space-between"
                            flexGrow={1}
                            onPress={handleLongPress}
                            pressStyle={{ backgroundColor: '$green4' }}
                        >
                            <Label onPress={handleLongPress}>{item.item_name}</Label>
                            <Label>
                                {item.price
                                    ? `$${(item?.price).toFixed(2)}/${item.price_type}`
                                    : undefined}
                            </Label>
                        </XStack>
                    </XStack>
                </ListItem>
            </Theme>
        </Swipeable>
    );
};

export default memo(StoreItemRow);

const sectionColorDictionary: Record<StoreSection, ThemeName> = {
    Produce: 'green',
    Bulk: 'orange',
    'Meat/Deli': 'red',
    'Dairy/Eggs': 'yellow',
    Frozen: 'blue',
    'Toiletries/Paper Products/Cleaning Supplies': 'pink',
    'Non-perishable': 'purple',
    Miscellaneous: 'gray',
};
