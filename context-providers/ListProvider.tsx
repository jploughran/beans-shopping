import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import invariant from 'tiny-invariant';

import { ListCreationType } from '@/components/AddListForm';
import { supabase } from '@/modules/supabase';
import { handleSupabaseInsertRow } from '@/modules/supabase-list-utils';
import { LISTS, List } from '@/types/list';

export interface ListsProviderContextValues {
    allLists: List[] | undefined;
    selectedList: List | undefined;
    setSelectedList: Dispatch<SetStateAction<List | undefined>>;
    handleAddList: (formValues: ListCreationType) => Promise<void>;
}

export const ListsProviderContext = createContext<ListsProviderContextValues | null>(null);

export const ListsProvider = ({
    children,
}: Record<string, unknown> & {
    children?: ReactNode;
}) => {
    const [allLists, setAllLists] = useState<List[]>();
    const [selectedList, setSelectedList] = useState<List>();

    useEffect(() => {
        const getAllListsForUser = async () => {
            const { data: lists, error } = await supabase.from('lists').select('*');
            console.log({ lists });
            if (lists) {
                setAllLists(lists as List[]);
            }
            if (error) {
                console.log('error getting lists for user', { error });
            }
        };
        getAllListsForUser();
    }, []);

    const handleAddList = useCallback(async (formValues: ListCreationType) => {
        await handleSupabaseInsertRow(formValues, LISTS).then((listAdded) =>
            setAllLists((prev) => prev?.concat([listAdded as List])),
        );
    }, []);

    const contextValue: ListsProviderContextValues = useMemo(() => {
        return { allLists, selectedList, setSelectedList, handleAddList };
    }, [allLists, selectedList, handleAddList]);

    return (
        <ListsProviderContext.Provider value={contextValue}>
            {children}
        </ListsProviderContext.Provider>
    );
};

export const useListsProviderContext = () => {
    const ctx = useContext(ListsProviderContext);

    invariant(ctx, 'useListsProviderContext called outside of ListsProviderContext');

    return ctx;
};

export const useSelectedList = () => {
    return useListsProviderContext().selectedList;
};

export const useAllUserLists = () => {
    return useListsProviderContext().allLists;
};
