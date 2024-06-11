import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Formik, useField } from 'formik';
import { memo, useState } from 'react';
import { KeyboardTypeOptions } from 'react-native';
import { Button, Input, SizableText, ToggleGroup, XStack, YStack } from 'tamagui';

import FormErrorText from './FormErrorText';
import InputLabel from './InputLabel';
import LoadingView from './LoadingView';

import { useStoreItemProviderContext } from '@/context-providers/StoreItemsProvider';
import {
    InitialListItemFormValue,
    newStoreItemValidationSchema,
} from '@/modules/add-list-item-validation';
import { StoreItem } from '@/types/list';
import StoreSectionSelector from './StoreSectionSelector';

export interface ItemFormInitialValues extends Partial<StoreItem> {}

interface Props {
    closeForm: () => void;
    itemToEdit: StoreItem;
}

function AddStoreItemForm({ itemToEdit, closeForm }: Props) {
    const { handleUpdateStoreItem } = useStoreItemProviderContext();
    const [loading, setLoading] = useState(false);

    return (
        <Dialog open onClose={() => closeForm()} fullWidth maxWidth="sm">
            <DialogTitle>Edit Item</DialogTitle>

            <Formik
                initialValues={itemToEdit}
                validationSchema={newStoreItemValidationSchema}
                onSubmit={async (formValues, { resetForm }) => {
                    setLoading(true);
                    await handleUpdateStoreItem(formValues).then(() => {
                        setLoading(false);
                        resetForm();
                        closeForm();
                    });
                }}
                validateOnMount
                enableReinitialize
            >
                {({ values, errors, setFieldValue, handleSubmit, isValid }) => (
                    <LoadingView
                        loading={loading}
                        message="Saving..."
                        style={{ justifyContent: 'center', marginVertical: 20 }}
                    >
                        <>
                            <DialogContent>
                                <YStack gap="$4">
                                    <XStack gap="$3" width="100%" alignItems="center">
                                        <InputLabel label="Name" />
                                        <InputField
                                            fieldName="item_name"
                                            placeholder="Enter name here..."
                                            keyboardType="default"
                                        />
                                    </XStack>
                                    <XStack
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
                                            onValueChange={(type) =>
                                                setFieldValue('price_type', type)
                                            }
                                        >
                                            <ToggleGroup.Item
                                                value="weight"
                                                aria-label="Left aligned"
                                            >
                                                <SizableText>Weight</SizableText>
                                            </ToggleGroup.Item>
                                            <ToggleGroup.Item
                                                value="count"
                                                aria-label="Center aligned"
                                            >
                                                <SizableText>Count</SizableText>
                                            </ToggleGroup.Item>
                                        </ToggleGroup>
                                    </XStack>
                                    <XStack gap="$3" width="100%" alignItems="center">
                                        <InputLabel label="Price/item" />
                                        <InputField
                                            fieldName="price"
                                            placeholder="Enter price (estimated) here..."
                                            keyboardType="numeric"
                                        />
                                    </XStack>
                                    <StoreSectionSelector />

                                    <FormErrorText errors={errors} />
                                </YStack>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    minWidth={100}
                                    marginRight="$4"
                                    variant="outlined"
                                    borderWidth="$0.25"
                                    size="$3"
                                    onPress={() => {
                                        closeForm();
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
                            </DialogActions>
                        </>
                    </LoadingView>
                )}
            </Formik>
        </Dialog>
    );
}

export default memo(AddStoreItemForm);

const InputField = ({
    fieldName,
    placeholder,
    keyboardType,
}: {
    fieldName: keyof InitialListItemFormValue;
    placeholder: string;
    keyboardType: KeyboardTypeOptions;
}) => {
    const [{ value }, , { setValue }] = useField(fieldName);

    return (
        <Input
            size="$3"
            flex={4}
            placeholder={placeholder}
            keyboardType={keyboardType}
            value={value}
            onChangeText={(price) => setValue(price)}
        />
    );
};
