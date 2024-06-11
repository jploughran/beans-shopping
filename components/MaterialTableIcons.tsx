/* eslint-disable react/display-name */
import { Icons } from '@material-table/core';
import {
    AddBox,
    ArrowDownward,
    Check,
    ChevronLeft,
    ChevronRight,
    Clear,
    DeleteOutline,
    Edit,
    FilterList,
    FirstPage,
    LastPage,
    Remove,
    SaveAlt,
    Search,
    ViewColumn,
} from '@mui/icons-material';
import { forwardRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TABLE_ICONS: Icons<any> = {
    Add: forwardRef<SVGSVGElement>((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef<SVGSVGElement>((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef<SVGSVGElement>((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef<SVGSVGElement>((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef<SVGSVGElement>((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef<SVGSVGElement>((props, ref) => (
        // add margin to reduce column width changes upon editing
        <Edit {...props} ref={ref} style={{ marginLeft: '.55em', marginRight: '.55em' }} />
    )),
    Export: forwardRef<SVGSVGElement>((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef<SVGSVGElement>((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef<SVGSVGElement>((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef<SVGSVGElement>((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef<SVGSVGElement>((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef<SVGSVGElement>((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef<SVGSVGElement>((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef<SVGSVGElement>((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef<SVGSVGElement>((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef<SVGSVGElement>((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef<SVGSVGElement>((props, ref) => <ViewColumn {...props} ref={ref} />),
};
