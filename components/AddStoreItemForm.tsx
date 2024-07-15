import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Formik, useField } from 'formik';
import { memo, useState } from 'react';
import { KeyboardTypeOptions } from 'react-native';
import { Button, Input, SizableText, ToggleGroup, XStack, YStack } from 'tamagui';

import FormErrorText from './FormErrorText';
import InputLabel from './InputLabel';
import LoadingView from './LoadingView';
import StoreSectionSelector from './StoreSectionSelector';

import { useBottomSheetProviderContext } from '@/context-providers/BottomSheetProvider';
import { useStoreItemProviderContext } from '@/context-providers/StoreItemsProvider';
import {
    InitialListItemFormValue,
    newStoreItemValidationSchema,
} from '@/modules/add-list-item-validation';
import { StoreItem } from '@/types/list';

export interface ItemFormInitialValues extends Partial<StoreItem> {}

interface Props {
    itemToEdit: StoreItem | undefined;
    closeForm?: () => void;
}

function AddStoreItemForm({ itemToEdit }: Props) {
    const { handleUpdateStoreItem } = useStoreItemProviderContext();
    const [loading, setLoading] = useState(false);
    const { handleClosePress } = useBottomSheetProviderContext();

    if (!itemToEdit) {
        return null;
    }

    return (
        <Formik
            initialValues={itemToEdit}
            validationSchema={newStoreItemValidationSchema}
            onSubmit={async (formValues, { resetForm }) => {
                setLoading(true);
                await handleUpdateStoreItem(formValues).then(() => {
                    setLoading(false);
                    resetForm();
                    handleClosePress();
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
                                <InputLabel label="Price/item" />
                                <InputField
                                    fieldName="price"
                                    placeholder="Enter price (estimated) here..."
                                    keyboardType="numeric"
                                />
                            </XStack>
                            <StoreSectionSelector />

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
