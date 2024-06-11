import MTable, { Components, MaterialTableProps, Options } from '@material-table/core';
import { CircularProgress, alpha, Theme } from '@mui/material';
import { useMemo } from 'react';

import { TABLE_ICONS } from './MaterialTableIcons';

const OverlayLoading = ({ theme }: { theme: Theme }) => (
    <div
        style={{
            display: 'table',
            width: '100%',
            height: '100%',
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
        }}
    >
        <div
            style={{
                display: 'table-cell',
                width: '100%',
                height: '100%',
                verticalAlign: 'middle',
                textAlign: 'center',
            }}
        >
            <CircularProgress />
        </div>
    </div>
);

const TABLE_COMPONENTS: Components = { OverlayLoading };

interface Props<T extends object> extends MaterialTableProps<T> {
    loading?: boolean;
    onSelectionChange?: (items: T[]) => void;
}

export default function MaterialTable<T extends object>({
    components,
    loading,
    options,
    onSelectionChange,
    ...rest
}: Props<T>) {
    const tableHeight = ((window.innerHeight - 64 - 52 - 1) / window.innerHeight) * 65;
    const tableOptions = useMemo(
        (): Options<T> => ({
            actionsColumnIndex: -1,
            emptyRowsWhenPaging: false,
            columnsButton: true,
            filtering: true,
            filterCellStyle: { position: 'sticky', top: 33, backgroundColor: 'white' },
            headerStyle: { position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 },
            maxColumnSort: 1,
            maxBodyHeight: `${tableHeight}vh`,
            minBodyHeight: `${tableHeight}vh`,
            pageSizeOptions: [50, 100, 1000],
            pageSize: 100,
            selection: !!onSelectionChange,
            thirdSortClick: false,
            ...(options ?? {}),
        }),
        [onSelectionChange, options, tableHeight],
    );

    const tableComponents = useMemo(() => ({ ...TABLE_COMPONENTS, ...components }), [components]);

    return (
        <MTable
            components={tableComponents}
            icons={TABLE_ICONS}
            isLoading={loading}
            options={tableOptions}
            onSelectionChange={onSelectionChange}
            {...rest}
        />
    );
}
