import { Action, Column } from '@material-table/core';
import { Plus, Trash } from '@tamagui/lucide-icons';
import { format } from 'date-fns';
import { memo, useMemo, useState } from 'react';
import { Button, SizableText, XStack, YStack } from 'tamagui';

import AddStoreItemForm from './AddStoreItemForm';
import MaterialTable from './MaterialTable';

import { useStoreItemProviderContext } from '@/context-providers/StoreItemsProvider';
import { StoreItem } from '@/types/list';
import FormBottomSheet from './FormBottomSheet';

const StoreItemTable = () => {
    const { selectedStoreItems, selectedStoreId, handleRemoveStoreItem, selectedStoreName } =
        useStoreItemProviderContext();
    const [itemToEdit, setItemToEdit] = useState<StoreItem>();

    const actions: Action<StoreItem>[] = useMemo(
        () => [
            {
                icon: () => <Trash color="$red10" size="$1" />,
                onClick: async (event: unknown, rowData: StoreItem | StoreItem[]) => {
                    if (!Array.isArray(rowData)) await handleRemoveStoreItem(rowData.item_id);
                },
                tooltip: 'Delete Item?',
            },
        ],
        [handleRemoveStoreItem],
    );
    if (!selectedStoreId) {
        return null;
    }

    return (
        <>
            <MaterialTable
                loading={!selectedStoreItems}
                data={selectedStoreItems ?? []}
                columns={storeItemColumns}
                actions={actions}
                title={
                    <XStack gap="$3" alignItems="center">
                        <SizableText size="$6">{selectedStoreName} Items</SizableText>
                        <Button
                            icon={<Plus />}
                            onPress={() =>
                                setItemToEdit({
                                    store_section: 'Miscellaneous',
                                    store_id: selectedStoreId,
                                    price_type: 'count',
                                    item_name: '',
                                } as StoreItem)
                            }
                        >
                            Add Item
                        </Button>
                    </XStack>
                }
                onRowClick={(event, rowData) => setItemToEdit(rowData)}
            />
            {itemToEdit ? (
                <AddStoreItemForm
                    closeForm={() => setItemToEdit(undefined)}
                    itemToEdit={itemToEdit}
                />
            ) : null}
        </>
    );
};
export default memo(StoreItemTable);

const storeItemColumns: Column<StoreItem>[] = [
    {
        editable: 'never',
        field: 'item_name',
        filtering: true,
        title: 'Name',
        render: (data) => <SizableText>{data.item_name}</SizableText>,
    },
    {
        editable: 'never',
        field: 'item_id',
        filtering: true,
        title: 'ID',
        render: (data) => <SizableText>{data.item_id}</SizableText>,
        hidden: true,
    },
    {
        editable: 'never',
        field: 'price',
        filtering: true,
        title: 'Price',
        render: (data) => <SizableText>{data.price}</SizableText>,
    },
    {
        editable: 'never',
        field: 'price_type',
        filtering: true,
        title: 'Price Type',
        render: (data) => <SizableText>{data.price_type}</SizableText>,
        hidden: true,
    },
    {
        editable: 'never',
        field: 'created_at',
        filtering: true,
        title: 'Created At',
        render: (data) => <SizableText>{format(data.created_at ?? 0, 'Pp')}</SizableText>,
    },
];
