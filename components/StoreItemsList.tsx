import { Check, Salad } from '@tamagui/lucide-icons';
import { useField, useFormikContext } from 'formik';
import Fuse, { IFuseOptions } from 'fuse.js';
import { memo, useMemo } from 'react';
import { ListItem, ScrollView, XStack } from 'tamagui';

import { useStoreItemProviderContext } from '@/context-providers/StoreItemsProvider';
import { InitialListItemFormValue } from '@/modules/add-list-item-validation';
import { StoreItem } from '@/types/list';

const fuseOptions: IFuseOptions<StoreItem> = {
    minMatchCharLength: 2,
    threshold: 0.15,
    keys: [{ name: 'item_name', weight: 2.5 }],
};

const StoreItemsList = () => {
    const { selectedStoreItems } = useStoreItemProviderContext();
    const [{ value: itemName }, ,] = useField<string>('item_name');
    const fuseList = useMemo(
        () => new Fuse(selectedStoreItems ?? [], fuseOptions),
        [selectedStoreItems],
    );

    return itemName ? (
        <ScrollView
            horizontal
            flexDirection="row"
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <XStack gap="$2">
                {fuseList.search(itemName).map(({ item }, i) => {
                    return <StoreItemRow item={item} key={item.created_at} />;
                })}
            </XStack>
        </ScrollView>
    ) : null;
};

export default memo(StoreItemsList);

const StoreItemRow = ({ item }: { item: StoreItem }) => {
    const { setValues, values } = useFormikContext<InitialListItemFormValue>();

    const isChosen = useMemo(() => values.item_id === item.item_id, [item.item_id, values.item_id]);

    return (
        <ListItem
            key={item.created_at}
            icon={isChosen ? Check : Salad}
            backgroundColor={isChosen ? '$green6' : '$green4'}
            title={item.item_name}
            subTitle={`$${item.price}`}
            flex={1}
            enterStyle={{
                scale: 0.5,
                y: -10,
                opacity: 0,
            }}
            animation="medium"
            paddingVertical="$2"
            paddingHorizontal="$3"
            borderRadius="$3"
            onPress={() => {
                setValues((prev) => ({
                    ...prev,
                    ...item,
                    price: item.price?.toString() ?? '0',
                }));
            }}
        />
    );
};
