import { ListPlus } from '@tamagui/lucide-icons';
import { memo, useMemo, useState } from 'react';
import {
    Button,
    H3,
    H4,
    H5,
    H6,
    Popover,
    ScrollView,
    Separator,
    SizableText,
    XStack,
    YStack,
} from 'tamagui';

import { AddListItemForm } from '@/components/AddListItemForm';
import StoreListItem from '@/components/StoreListItem';
import { useListItemsProviderContext } from '@/context-providers/ListItemsProvider';
import { ListItemWithData } from '@/types/list';

const getCostForItems = (itemsWithCost: ListItemWithData[]) =>
    itemsWithCost
        .reduce((totalCost, currentItem) => {
            if (currentItem?.price && currentItem?.quantity) {
                totalCost = totalCost + currentItem?.price * currentItem?.quantity;
            }
            return totalCost;
        }, 0)
        .toFixed(2);

const EditList = () => {
    const { itemsWithCost } = useListItemsProviderContext();
    const [openForm, setOpenForm] = useState(false);
    const unCheckedItems = useMemo(
        () => itemsWithCost.filter(({ completed }) => !completed),
        [itemsWithCost],
    );
    const checkedItems = useMemo(
        () => itemsWithCost.filter(({ completed }) => completed),
        [itemsWithCost],
    );
    const estimatedTotal = useMemo(() => getCostForItems(itemsWithCost), [itemsWithCost]);

    const checkedTotal = useMemo(() => getCostForItems(checkedItems), [checkedItems]);
    const unCheckedTotal = useMemo(() => getCostForItems(unCheckedItems), [unCheckedItems]);

    return (
        <YStack margin="$4">
            <H5 alignSelf="center">Totals</H5>
            <XStack gap="$4" alignItems="center">
                <SizableText>Estimated - ${estimatedTotal}</SizableText>
                <SizableText color="$green11">Checked - ${checkedTotal}</SizableText>
                <SizableText color="$red10">Remaining - ${unCheckedTotal}</SizableText>
            </XStack>
            <Separator marginTop="$3" backgroundColor="$green10" />
            <ScrollView>
                <H3 marginVertical="$4">Remaining Items</H3>
                {unCheckedItems.map((item) => (
                    <StoreListItem item={item} />
                ))}
                <Button icon={ListPlus} marginTop="$4" onPress={() => setOpenForm(true)} />
                <Separator />
                <H3 marginVertical="$4">Checked Items</H3>
                {checkedItems.map((item) => (
                    <StoreListItem item={item} />
                ))}
                {openForm ? <AddListItemForm setOpenForm={setOpenForm} /> : null}
            </ScrollView>
        </YStack>
    );
};

export default memo(EditList);
