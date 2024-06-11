import { Trash } from '@tamagui/lucide-icons';
import { memo, useCallback, useState } from 'react';
import { Button } from 'tamagui';

import LoadingView from './LoadingView';

interface Props {
    itemId: number;
    handleRemoveItem: (itemToRemoveId: number) => Promise<void>;
}

const DeleteFromListButton = ({ itemId, handleRemoveItem }: Props) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = useCallback(async () => {
        setLoading(true);
        await handleRemoveItem(itemId).finally(() => setLoading(false));
    }, [handleRemoveItem, itemId]);

    return (
        <LoadingView message="" loading={loading}>
            <Button
                alignSelf="center"
                icon={<Trash color="$red10" />}
                onPress={handleDelete}
                padding="$3"
                chromeless
            />
        </LoadingView>
    );
};

export default memo(DeleteFromListButton);
