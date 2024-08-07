import { router } from 'expo-router';
import { memo } from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { ListItem } from 'tamagui';

import DeleteFromListButton from './DeleteFromListButton';

import { useListsProviderContext } from '@/context-providers/ListProvider';
import { List } from '@/types/list';

interface Props {
    list: List;
}

const ListRow = ({ list }: Props) => {
    const { setSelectedList, handleRemoveList } = useListsProviderContext();

    return (
        <Swipeable
            leftThreshold={20}
            renderRightActions={() => (
                <DeleteFromListButton itemId={list.list_id} handleRemoveItem={handleRemoveList} />
            )}
            containerStyle={{ alignContent: 'center', flex: 1, justifyContent: 'center' }}
        >
            <ListItem
                title={list.list_name}
                borderRadius="$4"
                borderColor="$green4"
                borderWidth="$0.5"
                backgroundColor="$green1.25"
                marginTop="$1.5"
                height="$5"
                pressTheme
                onPress={() => {
                    router.push('/edit-list');
                    setSelectedList(list);
                }}
            />
        </Swipeable>
    );
};

export default memo(ListRow);
