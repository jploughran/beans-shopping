import { ListPlus } from '@tamagui/lucide-icons';
import { useState, useEffect, useCallback, memo } from 'react';
import DraggableFlatList, {
    DragEndParams,
    RenderItemParams,
} from 'react-native-draggable-flatlist';
import { Button, H5, Separator, SizableText, Tabs } from 'tamagui';

import { AddListItemForm } from './AddListItemForm';
import FormBottomSheet from './FormBottomSheet';
import LoadingView from './LoadingView';
import StoreListItem from './StoreListItem';

import { useBottomSheetProviderContext } from '@/context-providers/BottomSheetProvider';
import { useListItemsProviderContext } from '@/context-providers/ListItemsProvider';
import { InitialListItemFormValue } from '@/modules/add-list-item-validation';
import { handleSupabaseUpsert } from '@/modules/supabase-list-utils';
import { ListItemWithData } from '@/types/list';

const EditListTabs = () => {
    const { itemsWithCost, handleUpdateListItem, setItemsWithCost } = useListItemsProviderContext();

    const { handleOpenPress } = useBottomSheetProviderContext();
    const [itemToEdit, setItemToEdit] = useState<InitialListItemFormValue>();
    const [unCheckedItems, setUncheckedItems] = useState<ListItemWithData[]>(
        itemsWithCost
            .filter(({ completed }) => !completed)
            .sort((a, b) => a.list_order - b.list_order),
    );
    const [checkedItems, setCheckedItems] = useState<ListItemWithData[]>(
        itemsWithCost
            .filter(({ completed }) => completed)
            .sort((a, b) => a.list_order - b.list_order),
    );

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

    const handleDragEnd = useCallback(
        async (
            dragData: ListItemWithData[],
            setFxn: React.Dispatch<React.SetStateAction<ListItemWithData[]>>,
            checked: boolean,
        ) => {
            const dataToSet = dragData.map((item, i) => ({ ...item, list_order: i }));
            setFxn(dataToSet);
            await handleSupabaseUpsert(
                dataToSet.map(({ list_item_id, list_order, list_id, item_id }) => ({
                    list_item_id,
                    list_order,
                    list_id,
                    item_id,
                })),
                'list_items',
            );
            if (checked) {
                setItemsWithCost(unCheckedItems?.concat(dataToSet));
            } else {
                setItemsWithCost(checkedItems?.concat(dataToSet));
            }
        },
        [checkedItems, setItemsWithCost, unCheckedItems],
    );

    const renderItem = useCallback(
        (props: RenderItemParams<ListItemWithData>) => (
            <StoreListItem {...props} setItemToEdit={setItemToEdit} />
        ),
        [],
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
            <Tabs.Content value="tab1" flex={0.9}>
                <LoadingView loading={!unCheckedItems} message="">
                    <DraggableList
                        listItems={unCheckedItems ?? []}
                        handleDragEnd={({ data }) => handleDragEnd(data, setUncheckedItems, false)}
                        renderItem={renderItem}
                    />
                </LoadingView>
                <Button
                    icon={ListPlus}
                    marginVertical="$3"
                    onPress={() => {
                        setItemToEdit(undefined);
                        handleOpenPress();
                    }}
                />
            </Tabs.Content>

            <Tabs.Content value="tab2" flex={1}>
                <LoadingView loading={!checkedItems} message="">
                    <DraggableList
                        listItems={checkedItems ?? []}
                        handleDragEnd={({ data }) => handleDragEnd(data, setCheckedItems, true)}
                        renderItem={renderItem}
                    />
                </LoadingView>
            </Tabs.Content>
            <FormBottomSheet>
                <AddListItemForm
                    itemToEdit={itemToEdit}
                    handleFormSubmit={itemToEdit ? handleSubmit : undefined}
                />
            </FormBottomSheet>
        </Tabs>
    );
};

export default memo(EditListTabs);

const DraggableList = ({
    listItems,
    handleDragEnd,
    renderItem,
}: {
    listItems: ListItemWithData[] | undefined;
    handleDragEnd: ((params: DragEndParams<ListItemWithData>) => void) | undefined;
    renderItem: (props: RenderItemParams<ListItemWithData>) => React.JSX.Element;
}) => {
    return (
        <DraggableFlatList
            data={listItems ?? []}
            onDragEnd={handleDragEnd}
            keyExtractor={(item, i) => item.list_item_id + item.item_name}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            ListEmptyComponent={
                <SizableText marginVertical="$8" size="$4" alignSelf="center">
                    Please add some items to get started...
                </SizableText>
            }
        />
    );
};