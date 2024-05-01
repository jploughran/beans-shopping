import BottomSheet from '@gorhom/bottom-sheet';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { ListPlus } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Button, ListItem, YStack } from 'tamagui';

import AddListForm from '@/components/AddListForm';
import { useBottomSheetProviderContext } from '@/context-providers/BottomSheetProvider';
import { useListsProviderContext } from '@/context-providers/ListProvider';
import { List } from '@/types/list';

const keyExtractor = (item: List, index: number) => index.toString();

export default function TabOneScreen() {
    const { allLists: lists, setSelectedList } = useListsProviderContext();
    const { handleOpenPress, sheetRef } = useBottomSheetProviderContext();

    const renderSingleRow: ListRenderItem<List> = useCallback(
        ({ item, ...rest }) => {
            if (!item) {
                return null;
            }
            return (
                <ListItem
                    title={item.list_name}
                    borderRadius="$4"
                    borderColor="$green4"
                    borderWidth="$0.5"
                    backgroundColor="$green1.25"
                    marginTop="$1.5"
                    height="$5"
                    pressTheme
                    onPress={() => {
                        console.log({ name: item.list_name });
                        setSelectedList(item);
                        router.push('/editList');
                    }}
                />
            );
        },
        [setSelectedList],
    );

    return (
        <YStack margin="$4" flex={1}>
            <FlashList
                keyExtractor={keyExtractor}
                data={lists}
                renderItem={renderSingleRow}
                estimatedItemSize={200}
            />
            <Button icon={ListPlus} size="$4" onPress={() => handleOpenPress()}>
                Add List
            </Button>
            <BottomSheet ref={sheetRef} index={-1} snapPoints={['75%']} enablePanDownToClose>
                <AddListForm />
            </BottomSheet>
        </YStack>
    );
}
