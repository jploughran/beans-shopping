import { memo } from 'react';
import DraggableFlatList, {
    DragEndParams,
    RenderItemParams,
} from 'react-native-draggable-flatlist';
import { SizableText } from 'tamagui';

import { ListItemWithData } from '@/types/list';

interface Props<T extends Partial<ListItemWithData>> {
    listItems: T[] | undefined;
    handleDragEnd: ((params: DragEndParams<T>) => void) | undefined;
    renderItem: (props: RenderItemParams<T>) => React.JSX.Element;
}

function DraggableList<T extends Partial<ListItemWithData>>({
    listItems,
    handleDragEnd,
    renderItem,
}: Props<T>) {
    return (
        <DraggableFlatList
            data={listItems ?? []}
            onDragEnd={handleDragEnd}
            keyExtractor={(item, i) => item.item_id + item.item_name + item.store_id + i}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            ListEmptyComponent={
                <SizableText marginVertical="$8" size="$4" alignSelf="center">
                    Please add some items to get started...
                </SizableText>
            }
        />
    );
}

export default memo(DraggableList);
