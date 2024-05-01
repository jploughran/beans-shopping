import { BottomSheetView, useBottomSheetInternal } from '@gorhom/bottom-sheet';
import { Formik, FormikErrors } from 'formik';
import { useCallback, useEffect, useMemo } from 'react';
import { Button, Input, Label, SizableText, ToggleGroup, XStack, YStack } from 'tamagui';

import StoreItemsList from './StoreItemsList';

import { useBottomSheetProviderContext } from '@/context-providers/BottomSheetProvider';
import { useListItemsProviderContext } from '@/context-providers/ListItemsProvider';
import { useListsProviderContext } from '@/context-providers/ListProvider';
import {
    InitialListItemFormValue,
    newListItemValidationSchema,
} from '@/modules/add-list-item-validation';
import { addListItem } from '@/modules/supabase-list-utils';
import { Keyboard } from 'react-native';

interface Props {
    // setOpenForm: () => void;
    itemToEdit?: InitialListItemFormValue;
    handleFormSubmit?: (formValues: InitialListItemFormValue) => Promise<void>;
}

export function AddListItemForm({ itemToEdit, handleFormSubmit }: Props) {
    const { selectedList } = useListsProviderContext();
    const { setItemsWithCost } = useListItemsProviderContext();
    const { handleClosePress, handleOpenPress } = useBottomSheetProviderContext();
    const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

    const initialValues: InitialListItemFormValue = useMemo(
        () =>
            itemToEdit
                ? itemToEdit
                : {
                      created_at: new Date(Date.now()).toLocaleDateString(),
                      completed: false,
                      description: '',
                      list_id: selectedList?.list_id ?? 0,
                      quantity: '',
                      item_name: '',
                      price: '',
                      price_type: 'count',
                      store_id: selectedList?.store_id ?? 0,
                      user_id: selectedList?.user_id ?? '',
                  },
        [itemToEdit, selectedList?.list_id, selectedList?.store_id, selectedList?.user_id],
    );
    const handleFormSubmission = useCallback(
        async (formValues: InitialListItemFormValue) => {
            console.log('handleSubmit called in AddListItemForm');
            if (handleFormSubmit) {
                await handleFormSubmit(formValues);
            } else {
                await addListItem(formValues)
                    .then((item) => {
                        setItemsWithCost((prev) => prev.concat([item]));
                    })
                    .catch((e) => console.log(e));
            }
            handleClosePress();
        },
        [handleClosePress, handleFormSubmit, setItemsWithCost],
    );

    console.log({ initialValues });

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={newListItemValidationSchema}
            onSubmit={async (formValues) => {
                await handleFormSubmission(formValues);
            }}
            validateOnMount
            enableReinitialize
        >
            {({ values, errors, dirty, setFieldValue, handleSubmit, isValid }) => (
                <BottomSheetView style={{ flex: 1 }}>
                    <YStack gap="$3" flex={1} padding="$1" marginTop="$2">
                        <XStack gap="$3" width="100%" alignItems="center">
                            <Label size="$2" htmlFor="name" flex={1}>
                                Name
                            </Label>
                            <Input
                                size="$3"
                                flex={4}
                                placeholder="Enter name here..."
                                value={values.item_name}
                                onChangeText={(name) => {
                                    console.log({ values });
                                    setFieldValue('item_name', name);
                                }}
                                onFocus={() => {
                                    shouldHandleKeyboardEvents.value = true;
                                }}
                                onBlur={() => {
                                    shouldHandleKeyboardEvents.value = false;
                                }}
                                clearButtonMode="always"
                            />
                        </XStack>
                        <StoreItemsList />
                        <XStack
                            gap="$2"
                            width="100%"
                            alignItems="center"
                            justifyContent="flex-start"
                        >
                            <Label size="$2" htmlFor="name" flex={1}>
                                Price Type
                            </Label>
                            <ToggleGroup
                                flex={4}
                                orientation="horizontal"
                                id="price_type"
                                type="single"
                                size="$1"
                                disableDeactivation
                                value={values.price_type}
                                onValueChange={(type) => setFieldValue('price_type', type)}
                            >
                                <ToggleGroup.Item value="weight" aria-label="Left aligned">
                                    <SizableText>Weight</SizableText>
                                </ToggleGroup.Item>
                                <ToggleGroup.Item value="count" aria-label="Center aligned">
                                    <SizableText>Count</SizableText>
                                </ToggleGroup.Item>
                            </ToggleGroup>
                        </XStack>
                        <XStack gap="$3" width="100%" alignItems="center">
                            <Label size="$2" htmlFor="name" flex={1}>
                                Quantity
                            </Label>
                            <Input
                                size="$3"
                                flex={4}
                                placeholder="Enter quantity here..."
                                keyboardType="numeric"
                                value={values.quantity}
                                onChangeText={(quantity) => setFieldValue('quantity', quantity)}
                                onFocus={() => {
                                    shouldHandleKeyboardEvents.value = true;
                                }}
                                onBlur={() => {
                                    shouldHandleKeyboardEvents.value = false;
                                }}
                            />
                        </XStack>
                        <XStack gap="$3" width="100%" alignItems="center">
                            <Label size="$1" htmlFor="name" flex={1}>
                                Price/item
                            </Label>
                            <Input
                                size="$3"
                                flex={4}
                                placeholder="Enter price (estimated) here..."
                                keyboardType="numeric"
                                value={values.price}
                                onChangeText={(price) => setFieldValue('price', price)}
                                onFocus={() => {
                                    shouldHandleKeyboardEvents.value = true;
                                }}
                                onBlur={() => {
                                    shouldHandleKeyboardEvents.value = false;
                                }}
                            />
                        </XStack>

                        <XStack gap="$4" justifyContent="flex-end">
                            <Button
                                minWidth={100}
                                variant="outlined"
                                borderWidth="$0.25"
                                size="$3"
                                onPress={() => {
                                    handleClosePress();
                                }}
                            >
                                Close
                            </Button>
                            <Button
                                minWidth={100}
                                disabled={!isValid}
                                size="$3"
                                disabledStyle={{ backgroundColor: '$red4' }}
                                onPress={() => {
                                    handleSubmit();
                                }}
                            >
                                Submit
                            </Button>
                        </XStack>
                        <YStack marginTop="$3">
                            {(
                                Object.keys(
                                    errors,
                                ) as (keyof FormikErrors<InitialListItemFormValue>)[]
                            ).map((field: keyof FormikErrors<InitialListItemFormValue>) => (
                                <SizableText key={field} size="$3" color="$red10">
                                    {typeof errors[field] === 'string'
                                        ? (errors[field] as string)
                                        : JSON.stringify(errors?.[field])}
                                </SizableText>
                            ))}
                        </YStack>
                    </YStack>
                </BottomSheetView>
            )}
        </Formik>
    );
}
