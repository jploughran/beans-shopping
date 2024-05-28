import { WINDOW_HEIGHT } from '@gorhom/bottom-sheet';
import { memo, useEffect, useMemo, useState } from 'react';
import { H5, Separator, SizableText, XStack, YStack } from 'tamagui';

import EditListTabs from '@/components/EditListTabs';
import LoadingView from '@/components/LoadingView';
import { useListItemsProviderContext } from '@/context-providers/ListItemsProvider';
import { ListItemWithData } from '@/types/list';

const getCostForItems = (itemsWithCost?: ListItemWithData[]) =>
    itemsWithCost
        ? itemsWithCost
              .reduce((totalCost, currentItem) => {
                  if (currentItem?.price && currentItem?.quantity) {
                      totalCost = totalCost + currentItem?.price * currentItem?.quantity;
                  }
                  return totalCost;
              }, 0)
              .toFixed(2)
        : 'Loading...';

const EditList = () => {
    const { itemsWithCost, listItemsLoading } = useListItemsProviderContext();

    const [unCheckedItems, setUncheckedItems] = useState<ListItemWithData[]>();
    const [checkedItems, setCheckedItems] = useState<ListItemWithData[]>();

    useEffect(
        () => setUncheckedItems(itemsWithCost?.filter(({ completed }) => !completed)),
        [itemsWithCost],
    );
    useEffect(
        () => setCheckedItems(itemsWithCost?.filter(({ completed }) => completed)),
        [itemsWithCost],
    );

    const estimatedTotal = useMemo(() => getCostForItems(itemsWithCost), [itemsWithCost]);

    const checkedTotal = useMemo(() => getCostForItems(checkedItems), [checkedItems]);
    const unCheckedTotal = useMemo(() => getCostForItems(unCheckedItems), [unCheckedItems]);

    return (
        <YStack
            margin="$4"
            marginTop="$2"
            height={WINDOW_HEIGHT}
            flex={1}
            animation={[
                '200ms',
                {
                    opacity: {
                        overshootClamping: true,
                    },
                },
            ]}
            $gtSm={{
                alignSelf: 'center',
                width: '50%',
            }}
        >
            <H5 alignSelf="center">Totals</H5>
            <XStack gap="$8" alignItems="center" justifyContent="center">
                <YStack alignItems="center">
                    <SizableText>Estimated</SizableText>
                    <SizableText>${estimatedTotal}</SizableText>
                </YStack>
                <YStack alignItems="center">
                    <SizableText color="$green11">Checked</SizableText>
                    <SizableText color="$green11">${checkedTotal}</SizableText>
                </YStack>
                <YStack alignItems="center">
                    <SizableText color="$red10">Remaining</SizableText>
                    <SizableText color="$red10">${unCheckedTotal}</SizableText>
                </YStack>
            </XStack>
            <Separator marginTop="$3" backgroundColor="$green10" />
            <EditListTabs />
        </YStack>
    );
};

export default memo(EditList);
