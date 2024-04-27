import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { ListPlus } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, ListItem, View as TamaguiView } from 'tamagui';

import { useListsProviderContext } from '@/context-providers/ListProvider';
import { List } from '@/types/list';

const keyExtractor = (item: List, index: number) => index.toString();

export default function TabOneScreen() {
    const { allLists: lists, setSelectedList } = useListsProviderContext();

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

    console.log({ lists });
    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <TamaguiView
                style={{
                    minHeight: 100,
                    width: Dimensions.get('screen').width,
                }}
                padding="$4"
            >
                <FlashList
                    keyExtractor={keyExtractor}
                    data={lists}
                    renderItem={renderSingleRow}
                    estimatedItemSize={200}
                    // ItemSeparatorComponent={<Separator />}
                />
            </TamaguiView>
            <Button icon={ListPlus} size="$4">
                Add List
            </Button>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
