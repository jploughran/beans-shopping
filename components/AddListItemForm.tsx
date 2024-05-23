import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Formik } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import { Button, SizableText, ToggleGroup, XStack, YStack } from 'tamagui';

import FormErrorText from './FormErrorText';
import InputField from './InputField';
import InputLabel from './InputLabel';
import LoadingView from './LoadingView';
import StoreItemsList from './StoreItemsList';

import { useBottomSheetProviderContext } from '@/context-providers/BottomSheetProvider';
import { useListItemsProviderContext } from '@/context-providers/ListItemsProvider';
import { useListsProviderContext } from '@/context-providers/ListProvider';
import {
    InitialListItemFormValue,
    newListItemValidationSchema,
} from '@/modules/add-list-item-validation';
import { addListItem } from '@/modules/supabase-list-utils';

interface Props {
    // setOpenForm: () => void;
    itemToEdit?: InitialListItemFormValue;
    handleFormSubmit?: (formValues: InitialListItemFormValue) => Promise<void>;
}

export function AddListItemForm({ itemToEdit, handleFormSubmit }: Props) {
    const { selectedList } = useListsProviderContext();
    const { setItemsWithCost, itemsWithCost } = useListItemsProviderContext();
    const { handleClosePress } = useBottomSheetProviderContext();
    const [loading, setLoading] = useState(false);

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
                      list_order: itemsWithCost.length,
                  },
        [
            itemToEdit,
            itemsWithCost.length,
            selectedList?.list_id,
            selectedList?.store_id,
            selectedList?.user_id,
        ],
    );
    const handleFormSubmission = useCallback(
        async (formValues: InitialListItemFormValue) => {
            console.log('handleSubmit called in AddListItemForm');
            if (handleFormSubmit) {
                await handleFormSubmit(formValues);
            } else {
                await addListItem(formValues)
                    .then((item) => {
                        setItemsWithCost((prev) =>
                            prev.concat([{ ...item, list_order: prev.length }]),
                        );
                    })
                    .catch((e) => console.log(e));
            }
            handleClosePress();
        },
        [handleClosePress, handleFormSubmit, setItemsWithCost],
    );

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={newListItemValidationSchema}
            onSubmit={async (formValues, { resetForm }) => {
                setLoading(true);
                await handleFormSubmission(formValues).then(() => {
                    setLoading(false);
                    resetForm();
                });
            }}
            validateOnMount
            enableReinitialize
        >
            {({ values, errors, setFieldValue, handleSubmit, isValid }) => (
                <BottomSheetView style={{ flex: 1 }}>
                    <LoadingView
                        loading={loading}
                        message="Saving..."
                        style={{ justifyContent: 'flex-start', marginTop: '20%' }}
                    >
                        <YStack
                            gap="$3"
                            flex={1}
                            padding="$1"
                            marginTop="$2"
                            $gtSm={{
                                alignSelf: 'center',
                                width: '48%',
                                borderWidth: '$0.5',
                                borderColor: '$green6',
                                borderRadius: '$4',
                                padding: '$4',
                                backgroundColor: '$green1',
                            }}
                        >
                            <XStack gap="$3" width="100%" alignItems="center">
                                <InputLabel label="Name" />
                                <InputField
                                    fieldName="item_name"
                                    placeholder="Enter name here..."
                                    keyboardType="default"
                                />
                            </XStack>
                            <StoreItemsList />
                            <XStack
                                gap="$2.5"
                                width="100%"
                                alignItems="center"
                                justifyContent="flex-start"
                            >
                                <InputLabel label="Price Type" />
                                <ToggleGroup
                                    flex={4}
                                    orientation="horizontal"
                                    id="price_type"
                                    type="single"
                                    size="$1"
                                    disableDeactivation
                                    value={values.price_type ?? undefined}
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
                                <InputLabel label="Quantity" />
                                <InputField
                                    fieldName="quantity"
                                    placeholder="Enter quantity here..."
                                    keyboardType="numeric"
                                />
                            </XStack>
                            <XStack gap="$3" width="100%" alignItems="center">
                                <InputLabel label="Price/item" />
                                <InputField
                                    fieldName="price"
                                    placeholder="Enter price (estimated) here..."
                                    keyboardType="numeric"
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
                            <FormErrorText errors={errors} />
                        </YStack>
                    </LoadingView>
                </BottomSheetView>
            )}
        </Formik>
    );
}
