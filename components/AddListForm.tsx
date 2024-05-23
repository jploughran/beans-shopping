import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Formik } from 'formik';
import { memo } from 'react';
import { Button, H6, Separator, SizableText, XStack, YStack } from 'tamagui';

import FormErrorText from './FormErrorText';
import InputField from './InputField';
import InputLabel from './InputLabel';
import StoreSelector from './StoreSelector';

import { useBottomSheetProviderContext } from '@/context-providers/BottomSheetProvider';
import { useListsProviderContext } from '@/context-providers/ListProvider';
import { newListValidationSchema } from '@/modules/add-list-item-validation';
import { RowType } from '@/types/supabase';

export type ListCreationType = Omit<
    RowType<'lists'>,
    'list_id' | 'user_id' | 'completed' | 'total_cost'
>;

const initialValues: ListCreationType = {
    created_at: new Date(Date.now()).toLocaleDateString(),
    list_name: '',
    store_id: 0,
};

interface Props {
    setOpenForm?: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddListForm({ setOpenForm }: Props) {
    const { handleAddList } = useListsProviderContext();
    const { handleClosePress } = useBottomSheetProviderContext();

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={newListValidationSchema}
            onSubmit={async (formValues, { resetForm }) => {
                await handleAddList(formValues).then(() => {
                    resetForm();
                    handleClosePress();
                });
            }}
        >
            {({ errors, dirty, handleSubmit, isValid, resetForm }) => (
                <BottomSheetView style={{ flex: 1 }}>
                    <YStack
                        gap="$3"
                        flex={1}
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
                        <H6>Add New List</H6>
                        <Separator />
                        <SizableText>Please enter the name and choose the store</SizableText>
                        <XStack alignItems="center">
                            <InputLabel label="List Name" size="$1" />
                            <InputField
                                fieldName="item_name"
                                placeholder="Enter name here..."
                                keyboardType="default"
                            />
                        </XStack>
                        <StoreSelector />
                        <XStack gap="$4" justifyContent="flex-end">
                            <Button
                                minWidth={100}
                                variant="outlined"
                                borderWidth="$0.25"
                                size="$3"
                                onPress={() => {
                                    handleClosePress();
                                    resetForm();
                                }}
                            >
                                Close
                            </Button>
                            <Button
                                minWidth={100}
                                disabled={!dirty || !isValid}
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
                </BottomSheetView>
            )}
        </Formik>
    );
}

export default memo(AddListForm);
