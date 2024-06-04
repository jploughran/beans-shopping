import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { ListPlus } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { memo, useCallback } from 'react';
import { Button, SizableText, YStack } from 'tamagui';

import ListRow from './ListRow';

import { useListsProviderContext } from '@/context-providers/ListProvider';
import { List } from '@/types/list';

const keyExtractor = (item: List, index: number) => index.toString();

const Lists = () => {
    const { allLists: lists } = useListsProviderContext();

    const renderSingleRow: ListRenderItem<List> = useCallback(({ item, ...rest }) => {
        if (!item) {
            return null;
        }
        return <ListRow list={item} />;
    }, []);

    return (
        <YStack
            margin="$4"
            flex={1}
            $gtSm={{
                alignSelf: 'center',
                width: '50%',
                minHeight: 50,
            }}
        >
            <FlashList
                keyExtractor={keyExtractor}
                data={lists}
                renderItem={renderSingleRow}
                estimatedItemSize={200}
                ListEmptyComponent={
                    <SizableText marginVertical="$8" size="$4" alignSelf="center">
                        Please add some lists to get started...
                    </SizableText>
                }
            />
            <Button
                icon={ListPlus}
                size="$4"
                onPress={() => {
                    router.push('/create-list');
                }}
            >
                Add List
            </Button>
        </YStack>
    );
};

export default memo(Lists);
