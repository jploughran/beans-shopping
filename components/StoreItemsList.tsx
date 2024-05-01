import { Salad } from '@tamagui/lucide-icons';
import { useField, useFormikContext } from 'formik';
import Fuse, { IFuseOptions } from 'fuse.js';
import { memo, useMemo } from 'react';
import { ListItem, ScrollView, XStack } from 'tamagui';

import { useListItemsProviderContext } from '@/context-providers/ListItemsProvider';
import { InitialListItemFormValue } from '@/modules/add-list-item-validation';
import { ListItemWithData } from '@/types/list';

const fuseOptions: IFuseOptions<ListItemWithData> = {
    minMatchCharLength: 2,
    threshold: 0.4,
    keys: [{ name: 'item_name', weight: 2.5 }],
};

const StoreItemsList = () => {
    const { allStoreItemsWithCost } = useListItemsProviderContext();
    const [{ value: itemName }, ,] = useField<string>('item_name');
    const { setValues, handleSubmit } = useFormikContext<InitialListItemFormValue>();
    const fuseList = useMemo(
        () => new Fuse(allStoreItemsWithCost, fuseOptions),
        [allStoreItemsWithCost],
    );
    return itemName ? (
        <XStack>
            <ScrollView horizontal flexDirection="row">
                <XStack gap="$2">
                    {fuseList.search(itemName).map(({ item }) => (
                        <ListItem
                            key={item.created_at}
                            icon={Salad}
                            title={item.item_name}
                            subTitle={`$${item.price}`}
                            flex={1}
                            paddingVertical="$2"
                            paddingHorizontal="$3"
                            backgroundColor="$green5"
                            borderRadius="$3"
                            onPress={() => {
                                setValues({
                                    ...item,
                                    quantity: item.quantity?.toString() ?? '0',
                                    price: item.price?.toString() ?? '0',
                                }).then(() => handleSubmit());
                            }}
                        />
                    ))}
                </XStack>
            </ScrollView>
        </XStack>
    ) : null;
};

export default memo(StoreItemsList);
