import { Column } from '@material-table/core';
import { memo } from 'react';

import MaterialTable from './MaterialTable';

import { useStoreItemProviderContext } from '@/context-providers/StoreItemsProvider';
import { StoreItem } from '@/types/list';

const StoreItemTable = () => {
    const { selectedStoreItems, selectedStoreId } = useStoreItemProviderContext();
    if (!selectedStoreId) {
        return null;
    }
    return selectedStoreId ? (
        <MaterialTable data={selectedStoreItems ?? []} columns={storeItemColumns} />
    ) : null;
};

export default memo(StoreItemTable);

const storeItemColumns: Column<StoreItem>[] = [
    {
        editable: 'never',
        field: 'item_name',
        filtering: true,
        title: 'Name',
    },
    {
        editable: 'never',
        field: 'price',
        filtering: true,
        title: 'Price',
    },
    {
        editable: 'never',
        field: 'price_type',
        filtering: true,
        title: 'Price Type',
    },
    {
        editable: 'never',
        field: 'price_type',
        filtering: true,
        title: 'Price Type',
    },
    {
        editable: 'never',
        field: 'created_at',
        filtering: true,
        title: 'Created At',
    },
];
