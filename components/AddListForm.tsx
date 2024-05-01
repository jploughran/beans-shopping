import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Formik, FormikErrors } from 'formik';
import { memo } from 'react';
import { Button, H6, Input, Label, Separator, SizableText, XStack, YStack } from 'tamagui';

import StoreSelector from './StoreSelector';

import { useBottomSheetProviderContext } from '@/context-providers/BottomSheetProvider';
import { useListsProviderContext } from '@/context-providers/ListProvider';
import { newListValidationSchema } from '@/modules/add-list-item-validation';
import { RowType } from '@/types/supabase-types';

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
            onSubmit={async (formValues) => {
                await handleAddList(formValues).then(() => handleClosePress());
            }}
        >
            {({ values, errors, dirty, setFieldValue, handleSubmit, isValid, resetForm }) => (
                <BottomSheetView style={{ flex: 1 }}>
                    <YStack gap="$3" flex={1}>
                        <H6>Add New List</H6>
                        <Separator />
                        <SizableText>Please enter the name and choose the store</SizableText>
                        <XStack alignItems="center">
                            <Label size="$1" htmlFor="name" flex={1}>
                                List Name
                            </Label>
                            <Input
                                size="$3"
                                flex={5}
                                placeholder="Enter name here..."
                                value={values.list_name}
                                onChangeText={(name) => setFieldValue('list_name', name)}
                            />
                        </XStack>
                        <XStack>
                            <StoreSelector />
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
                        <YStack marginTop="$3">
                            {(Object.keys(errors) as (keyof FormikErrors<ListCreationType>)[]).map(
                                (field: keyof FormikErrors<ListCreationType>) => (
                                    <SizableText key={field} size="$3" color="$red10">
                                        {typeof errors[field] === 'string'
                                            ? (errors[field] as string)
                                            : JSON.stringify(errors?.[field])}
                                    </SizableText>
                                ),
                            )}
                        </YStack>
                    </YStack>
                </BottomSheetView>
            )}
        </Formik>
    );
}

export default memo(AddListForm);
