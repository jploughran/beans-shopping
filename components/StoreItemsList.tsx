import { Check, Salad } from '@tamagui/lucide-icons';
import { useField, useFormikContext } from 'formik';
import Fuse, { IFuseOptions } from 'fuse.js';
import { memo, useMemo } from 'react';
import { ListItem, ScrollView, XStack } from 'tamagui';

import { useListItemsProviderContext } from '@/context-providers/ListItemsProvider';
import { InitialListItemFormValue } from '@/modules/add-list-item-validation';
import { ListItemWithData } from '@/types/list';

const fuseOptions: IFuseOptions<ListItemWithData> = {
    minMatchCharLength: 2,
    threshold: 0.1,
    keys: [{ name: 'item_name', weight: 2.5 }],
};

const StoreItemsList = () => {
    const { allStoreItemsWithCost } = useListItemsProviderContext();
    const [{ value: itemName }, ,] = useField<string>('item_name');
    const fuseList = useMemo(
        () => new Fuse(allStoreItemsWithCost, fuseOptions),
        [allStoreItemsWithCost],
    );

    return itemName ? (
        <XStack>
            <ScrollView horizontal flexDirection="row">
                <XStack gap="$2">
                    {fuseList.search(itemName).map(({ item }, i) => {
                        console.log({ item });
                        return <StoreItem item={item} key={item.created_at} />;
                    })}
                </XStack>
            </ScrollView>
        </XStack>
    ) : null;
};

export default memo(StoreItemsList);

const StoreItem = ({ item }: { item: ListItemWithData }) => {
    const { setValues, handleSubmit, values } = useFormikContext<InitialListItemFormValue>();

    const isChosen = useMemo(() => values.item_id === item.item_id, [item.item_id, values.item_id]);

    return (
        <ListItem
            key={item.created_at}
            icon={isChosen ? Check : Salad}
            backgroundColor={isChosen ? '$green6' : '$green4'}
            title={item.item_name}
            subTitle={`$${item.price}`}
            flex={1}
            paddingVertical="$2"
            paddingHorizontal="$3"
            borderRadius="$3"
            onPress={() => {
                setValues({
                    ...item,
                    quantity: item.quantity?.toString() ?? '0',
                    price: item.price?.toString() ?? '0',
                }).then(() => handleSubmit());
            }}
        />
    );
};
