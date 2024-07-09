import { ArrowBigLeft, Wand2 } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { Button, SizableText, XStack } from 'tamagui';

import { useListItemsProviderContext } from '@/context-providers/ListItemsProvider';
import { useListsProviderContext } from '@/context-providers/ListProvider';
import { removeListItemsForListId } from '@/modules/supabase-list-utils';

const EditListTopTabName = () => {
    const { selectedList } = useListsProviderContext();
    const { setItemsWithCost } = useListItemsProviderContext();
    const handleClearList = useCallback(() => {
        if (!selectedList) {
            return;
        }
        if (Platform.OS === 'web' && window.confirm('Clear list?')) {
            removeListItemsForListId(selectedList.list_id)
                .then(() => setItemsWithCost([]))
                .catch((e) => console.log('Error clearing list', e));
            return;
        }
        Alert.alert(
            'Clear list?',
            'Would you like to clear the list completely and start a new trip?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () =>
                        await removeListItemsForListId(selectedList.list_id)
                            .then(() => setItemsWithCost([]))
                            .catch((e) => Alert.alert('Error clearing list', e)),
                    style: 'destructive',
                },
            ],
        );
    }, [selectedList, setItemsWithCost]);
    return (
        <XStack gap="$4" alignItems="center" width="90%" justifyContent="space-between">
            {Platform.OS === 'android' ? (
                <Button icon={ArrowBigLeft} chromeless onPress={() => router.back()} />
            ) : (
                <SizableText />
            )}
            <SizableText size="$6" alignSelf="center">
                {selectedList?.list_name ?? 'Edit List'}
            </SizableText>
            <Button
                icon={<Wand2 size="$1" />}
                chromeless
                alignSelf="flex-end"
                onPress={() => handleClearList()}
            />
        </XStack>
    );
};
export default EditListTopTabName;
