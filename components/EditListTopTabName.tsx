import { ArrowBigLeft } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { Button, SizableText, XStack } from 'tamagui';

import { useListsProviderContext } from '@/context-providers/ListProvider';

const EditListTopTabName = () => {
    const { selectedList } = useListsProviderContext();
    return (
        <XStack gap="$4" alignItems="center">
            {Platform.OS === 'android' ? (
                <Button icon={ArrowBigLeft} chromeless onPress={() => router.back()} />
            ) : null}
            <SizableText size="$6">{selectedList?.list_name ?? 'Edit List'}</SizableText>
        </XStack>
    );
};
export default EditListTopTabName;
