import { ListPlus } from '@tamagui/lucide-icons';
import { useState, useCallback, memo } from 'react';
import { RenderItemParams } from 'react-native-draggable-flatlist';
import { Button, H5, Separator, Tabs } from 'tamagui';

import { AddListItemForm } from './AddListItemForm';
import DraggableList from './DraggableList';
import FormBottomSheet from './FormBottomSheet';
import LoadingView from './LoadingView';
import StoreListItem from './StoreListItem';

import { useBottomSheetProviderContext } from '@/context-providers/BottomSheetProvider';
import { useListItemsProviderContext } from '@/context-providers/ListItemsProvider';
import { InitialListItemFormValue } from '@/modules/add-list-item-validation';
import { handleSupabaseUpsert } from '@/modules/supabase-list-utils';
import { ListItemWithData } from '@/types/list';

const EditListTabs = () => {
    const { setItemsWithCost, checkedItems, unCheckedItems, setCheckedItems, setUncheckedItems } =
        useListItemsProviderContext();

    const { handleOpenPress } = useBottomSheetProviderContext();
    const [itemToEdit, setItemToEdit] = useState<InitialListItemFormValue>();

    const handleDragEnd = useCallback(
        async (
            dragData: ListItemWithData[],
            setFxn: React.Dispatch<React.SetStateAction<ListItemWithData[] | undefined>>,
            checked: boolean,
        ) => {
            const dataToSet = dragData.map((item, i) => ({ ...item, list_order: i }));
            setFxn(dataToSet.sort((a, b) => a.list_order - b.list_order));
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
            <StoreListItem {...props} key={props.item.list_item_id} setItemToEdit={setItemToEdit} />
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
                <AddListItemForm itemToEdit={itemToEdit} />
            </FormBottomSheet>
        </Tabs>
    );
};

export default memo(EditListTabs);
