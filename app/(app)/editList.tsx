import BottomSheet, { WINDOW_HEIGHT } from '@gorhom/bottom-sheet';
import { ListPlus } from '@tamagui/lucide-icons';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Keyboard } from 'react-native';
import { Button, H3, H5, ScrollView, Separator, SizableText, View, XStack, YStack } from 'tamagui';

import { AddListItemForm } from '@/components/AddListItemForm';
import LoadingView from '@/components/LoadingView';
import StoreListItem from '@/components/StoreListItem';
import { useBottomSheetProviderContext } from '@/context-providers/BottomSheetProvider';
import { useListItemsProviderContext } from '@/context-providers/ListItemsProvider';
import { InitialListItemFormValue } from '@/modules/add-list-item-validation';
import { ListItemWithData } from '@/types/list';

import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';

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
    const { itemsWithCost, handleUpdateListItem, listItemsLoading } = useListItemsProviderContext();

    const { handleOpenPress, sheetRef } = useBottomSheetProviderContext();
    const [itemToEdit, setItemToEdit] = useState<InitialListItemFormValue>();
    const [unCheckedItems, setUncheckedItems] = useState<ListItemWithData[]>();
    const [checkedItems, setCheckedItems] = useState<ListItemWithData[]>();

    useEffect(
        () => setUncheckedItems(itemsWithCost.filter(({ completed }) => !completed)),
        [itemsWithCost],
    );
    useEffect(
        () => setCheckedItems(itemsWithCost.filter(({ completed }) => completed)),
        [itemsWithCost],
    );

    const estimatedTotal = useMemo(() => getCostForItems(itemsWithCost), [itemsWithCost]);

    const checkedTotal = useMemo(() => getCostForItems(checkedItems), [checkedItems]);
    const unCheckedTotal = useMemo(() => getCostForItems(unCheckedItems), [unCheckedItems]);

    const handleSubmit = useCallback(
        async (formValues: InitialListItemFormValue) => {
            const valuesToSubmit = {
                ...formValues,
                description: '',
                price: parseFloat(formValues.price ?? '0'),
                quantity: parseFloat(formValues.quantity ?? '0'),
            } as ListItemWithData;
            console.log(`handleSubmit called`, { valuesToSubmit });
            await handleUpdateListItem(valuesToSubmit);
        },
        [handleUpdateListItem],
    );

    return (
        <LoadingView loading={listItemsLoading}>
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

                <H3 marginVertical="$3">Remaining Items</H3>

                <DraggableFlatList
                    data={unCheckedItems ?? []}
                    onDragEnd={({ data }) => setUncheckedItems(data)}
                    keyExtractor={(item, i) => item.list_item_id + item.item_name}
                    renderItem={(props) => (
                        <StoreListItem {...props} setItemToEdit={setItemToEdit} />
                    )}
                />

                <Button
                    icon={ListPlus}
                    marginTop="$4"
                    onPress={() => {
                        setItemToEdit(undefined);
                        handleOpenPress();
                    }}
                />
                <Separator />
                <H3 marginVertical="$3">Checked Items</H3>

                <DraggableFlatList
                    data={checkedItems ?? []}
                    onDragEnd={({ data }) => setUncheckedItems(data)}
                    keyExtractor={(item, i) => item.list_item_id + item.item_name}
                    renderItem={(props) => (
                        <StoreListItem {...props} setItemToEdit={setItemToEdit} />
                    )}
                />
                <BottomSheet
                    ref={sheetRef}
                    index={-1}
                    snapPoints={['65%', '98%']}
                    enablePanDownToClose
                    keyboardBlurBehavior="restore"
                    keyboardBehavior="extend"
                    onClose={() => {
                        Keyboard.dismiss();
                    }}
                >
                    <AddListItemForm
                        itemToEdit={itemToEdit}
                        handleFormSubmit={itemToEdit ? handleSubmit : undefined}
                    />
                </BottomSheet>
            </YStack>
        </LoadingView>
    );
};

export default memo(EditList);
