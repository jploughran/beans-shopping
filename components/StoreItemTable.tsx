import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { ListPlus } from '@tamagui/lucide-icons';
import { memo, useCallback, useMemo, useState } from 'react';
import { Button, SizableText } from 'tamagui';

import AddStoreItemForm from './AddStoreItemForm';
import FormBottomSheet from './FormBottomSheet';
import LoadingView from './LoadingView';
import StoreItemRow from './StoreItemRow';

import { useBottomSheetProviderContext } from '@/context-providers/BottomSheetProvider';
import { useStoreItemProviderContext } from '@/context-providers/StoreItemsProvider';
import { StoreItem } from '@/types/list';

const StoreItemTable = () => {
    const { selectedStoreItems, selectedStoreId } = useStoreItemProviderContext();
    const [itemToEdit, setItemToEdit] = useState<StoreItem>();
    const { handleOpenPress } = useBottomSheetProviderContext();

    const renderItem: ListRenderItem<StoreItem> = useCallback(
        ({ item }) => <StoreItemRow key={item.item_id} item={item} setItemToEdit={setItemToEdit} />,
        [],
    );
    const initialStoreItemValues: Partial<StoreItem> = useMemo(
        () => ({
            item_name: '',
            price: null,
            price_type: 'count',
            store_id: selectedStoreId,
            store_section: 'Miscellaneous',
        }),
        [selectedStoreId],
    );
    const addStoreItem = useCallback(() => {
        setItemToEdit(initialStoreItemValues as StoreItem);
        handleOpenPress();
    }, [handleOpenPress, initialStoreItemValues]);

    if (!selectedStoreId) {
        return null;
    }

    return (
        <LoadingView loading={!selectedStoreItems} message="">
            <>
                <FlashList
                    renderItem={renderItem}
                    data={selectedStoreItems}
                    estimatedItemSize={54}
                    ListEmptyComponent={
                        <SizableText marginVertical="$8" size="$4" alignSelf="center">
                            Please add some items to get started...
                        </SizableText>
                    }
                />
                <Button icon={ListPlus} onPress={addStoreItem} />
                <FormBottomSheet>
                    {itemToEdit ? <AddStoreItemForm itemToEdit={itemToEdit} /> : null}
                </FormBottomSheet>
            </>
        </LoadingView>
    );
};

export default memo(StoreItemTable);
