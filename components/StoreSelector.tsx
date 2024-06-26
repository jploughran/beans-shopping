import { Check, Store as StoreIcon } from '@tamagui/lucide-icons';
import { useField } from 'formik';
import Fuse, { IFuseOptions } from 'fuse.js';
import { memo, useEffect, useMemo, useState } from 'react';
import { Input, Label, ListItem, ScrollView, XStack, YStack } from 'tamagui';

import { useStoreItemProviderContext } from '@/context-providers/StoreItemsProvider';
import { getStores } from '@/modules/supabase-list-utils';
import { Store } from '@/types/list';

const fuseOptions: IFuseOptions<Store> = {
    minMatchCharLength: 2,
    threshold: 0.2,
    keys: [{ name: 'storename', weight: 2.5 }],
};

const StoreSelector = () => {
    const { selectedStoreId } = useStoreItemProviderContext();

    console.log({ selectedStoreId });

    const [stores, setStores] = useState<Store[]>([]);
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchStores = async () => {
            await getStores().then((fetchedStores) => {
                setStores(fetchedStores);
                if (selectedStoreId) {
                    const store = fetchedStores.find(
                        ({ store_id }) => store_id === selectedStoreId,
                    );
                    if (store?.storename) {
                        setName(store?.storename || '');
                    }
                }
            });
        };
        fetchStores();
    }, [selectedStoreId]);

    const fuseList = useMemo(() => new Fuse(stores, fuseOptions), [stores]);
    return (
        <YStack>
            <XStack alignItems="center">
                <Label size="$2" htmlFor="store" flex={1} width="$4">
                    Store
                </Label>
                <Input
                    size="$3"
                    flex={4}
                    placeholder="Search for store here..."
                    value={name}
                    onChangeText={(name) => setName(name)}
                    clearButtonMode="always"
                />
            </XStack>
            <XStack marginTop="$4">
                <ScrollView horizontal flexDirection="row">
                    <XStack gap="$2">
                        {fuseList.search(name).map(({ item }) => (
                            <StoreItem key={item.created_at} item={item} setName={setName} />
                        ))}
                    </XStack>
                </ScrollView>
            </XStack>
        </YStack>
    );
};

export default memo(StoreSelector);

const StoreItem = ({
    item,
    setName,
}: {
    item: Store;
    setName: (value: React.SetStateAction<string>) => void;
}) => {
    const { setSelectedStoreId, setSelectedStoreName, selectedStoreId } =
        useStoreItemProviderContext();
    const [{ value: store_id }, , { setValue: setStoreId }] = useField<number>('store_id');

    const isChosen = useMemo(
        () => (store_id || selectedStoreId) === item.store_id,
        [item.store_id, selectedStoreId, store_id],
    );

    return (
        <ListItem
            icon={isChosen ? Check : StoreIcon}
            title={item.storename}
            flex={1}
            backgroundColor={isChosen ? '$green8' : '$green5'}
            borderRadius="$3"
            pressTheme
            onPress={() => {
                setSelectedStoreId(item.store_id);
                setSelectedStoreName(item.storename);
                setStoreId(item.store_id);
                setName(item.storename);
            }}
        />
    );
};
