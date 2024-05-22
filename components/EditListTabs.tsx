import BottomSheet from '@gorhom/bottom-sheet';
import { ListPlus } from '@tamagui/lucide-icons';
import { useState, useEffect, useCallback, memo } from 'react';
import { Keyboard } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Button, H5, Separator, Tabs } from 'tamagui';

import { AddListItemForm } from './AddListItemForm';
import StoreListItem from './StoreListItem';

import { useBottomSheetProviderContext } from '@/context-providers/BottomSheetProvider';
import { useListItemsProviderContext } from '@/context-providers/ListItemsProvider';
import { InitialListItemFormValue } from '@/modules/add-list-item-validation';
import { handleSupabaseUpsert } from '@/modules/supabase-list-utils';
import { ListItemWithData } from '@/types/list';

const EditListTabs = () => {
    const { itemsWithCost, handleUpdateListItem, setItemsWithCost } = useListItemsProviderContext();

    const { handleOpenPress, sheetRef } = useBottomSheetProviderContext();
    const [itemToEdit, setItemToEdit] = useState<InitialListItemFormValue>();
    const [unCheckedItems, setUncheckedItems] = useState<ListItemWithData[]>([]);
    const [checkedItems, setCheckedItems] = useState<ListItemWithData[]>([]);

    useEffect(() => {
        setUncheckedItems(
            itemsWithCost
                .filter(({ completed }) => !completed)
                .sort((a, b) => a.list_order - b.list_order),
        );
        setCheckedItems(
            itemsWithCost
                .filter(({ completed }) => completed)
                .sort((a, b) => a.list_order - b.list_order),
        );
    }, [itemsWithCost]);

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

    const renderItem = useCallback(
        (props: RenderItemParams<ListItemWithData>) => (
            <StoreListItem {...props} setItemToEdit={setItemToEdit} />
        ),
        [],
    );

    const handleDragEnd = useCallback(
        async (
            dragData: ListItemWithData[],
            setFxn: React.Dispatch<React.SetStateAction<ListItemWithData[]>>,
            checked: boolean,
        ) => {
            const dataToSet = dragData.map((item, i) => ({ ...item, list_order: i }));
            setFxn(dataToSet);
            await handleSupabaseUpsert(
                dataToSet.map(({ list_item_id, list_order }) => ({
                    list_item_id,
                    list_order,
                })),
                'list_items',
            );
            if (checked) {
                setItemsWithCost(unCheckedItems.concat(dataToSet));
            } else {
                setItemsWithCost(checkedItems.concat(dataToSet));
            }
        },
        [checkedItems, setItemsWithCost, unCheckedItems],
    );

    return (
        <Tabs
            defaultValue="tab1"
            orientation="horizontal"
            flexDirection="column"
            flex={1}
            marginTop="$3"
        >
            <Tabs.List separator={<Separator vertical />} marginBottom="$3" alignSelf="center">
                <Tabs.Tab value="tab1" borderWidth="$0.25" borderColor="$borderColor">
                    <H5>Remaining</H5>
                </Tabs.Tab>

                <Tabs.Tab value="tab2" borderWidth="$0.25" borderColor="$borderColor">
                    <H5>Checked</H5>
                </Tabs.Tab>
            </Tabs.List>
            <Tabs.Content value="tab1" flex={1}>
                <DraggableFlatList
                    data={unCheckedItems ?? []}
                    onDragEnd={({ data }) => handleDragEnd(data, setUncheckedItems, false)}
                    keyExtractor={(item, i) => item.list_item_id + item.item_name}
                    renderItem={renderItem}
                    containerStyle={{ maxHeight: '88%' }}
                    showsVerticalScrollIndicator={false}
                />
                <Button
                    icon={ListPlus}
                    marginTop="$4"
                    onPress={() => {
                        setItemToEdit(undefined);
                        handleOpenPress();
                    }}
                />
            </Tabs.Content>

            <Tabs.Content value="tab2">
                <DraggableFlatList
                    data={checkedItems ?? []}
                    onDragEnd={({ data }) => handleDragEnd(data, setCheckedItems, true)}
                    keyExtractor={(item, i) => item.list_item_id + item.item_name + i}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                />
            </Tabs.Content>
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
        </Tabs>
    );
};

export default memo(EditListTabs);
