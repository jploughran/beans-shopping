import { Formik, FormikErrors } from 'formik';
import { useCallback, useMemo } from 'react';
import {
    Adapt,
    Button,
    Input,
    Label,
    Popover,
    SizableText,
    ToggleGroup,
    XStack,
    YStack,
} from 'tamagui';

import { useListItemsProviderContext } from '@/context-providers/ListItemsProvider';
import { useListsProviderContext } from '@/context-providers/ListProvider';
import {
    InitialListItemFormValue,
    newListItemValidationSchema,
} from '@/modules/add-list-item-validation';
import { addListItem } from '@/modules/supabase-list-utils';

interface Props {
    setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
    itemToEdit?: InitialListItemFormValue;
    handleFormSubmit?: (formValues: InitialListItemFormValue) => Promise<void>;
}

export function AddListItemForm({ setOpenForm, itemToEdit, handleFormSubmit }: Props) {
    const { selectedList } = useListsProviderContext();
    const { setItemsWithCost } = useListItemsProviderContext();

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
            setOpenForm(false);
        },
        [handleFormSubmit, setItemsWithCost, setOpenForm],
    );
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={newListItemValidationSchema}
            onSubmit={async (formValues) => {
                await handleFormSubmission(formValues);
            }}
        >
            {({ values, errors, dirty, setFieldValue, handleSubmit, isValid }) => (
                <Popover size="$10" allowFlip open onOpenChange={(open) => setOpenForm(open)}>
                    <Adapt when="sm" platform="touch">
                        <Popover.Sheet modal dismissOnSnapToBottom>
                            <Popover.Sheet.Frame padding="$4">
                                <Adapt.Contents />
                            </Popover.Sheet.Frame>
                            <Popover.Sheet.Overlay
                                animation="lazy"
                                enterStyle={{ opacity: 0 }}
                                exitStyle={{ opacity: 0 }}
                            />
                        </Popover.Sheet>
                    </Adapt>

                    <Popover.Content
                        borderWidth={1}
                        flex={1}
                        alignSelf="center"
                        borderColor="$borderColor"
                        enterStyle={{ y: -20, opacity: 0 }}
                        exitStyle={{ y: -20, opacity: 0 }}
                        elevate
                        animation={[
                            'quick',
                            {
                                opacity: {
                                    overshootClamping: true,
                                },
                            },
                        ]}
                    >
                        <YStack gap="$3" flex={1}>
                            <XStack gap="$3" width="100%" alignItems="center">
                                <Label size="$3" htmlFor="name" flex={1}>
                                    Name
                                </Label>
                                <Input
                                    size="$3"
                                    flex={5}
                                    placeholder="Enter name here..."
                                    value={values.item_name}
                                    onChangeText={(name) => setFieldValue('item_name', name)}
                                />
                            </XStack>
                            <XStack
                                gap="$3"
                                width="100%"
                                alignItems="center"
                                justifyContent="flex-start"
                            >
                                <Label size="$2" htmlFor="name">
                                    Price Type
                                </Label>
                                <ToggleGroup
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
                                <Label size="$3" htmlFor="name" flex={1}>
                                    Quantity
                                </Label>
                                <Input
                                    size="$3"
                                    flex={5}
                                    placeholder="Enter quantity here..."
                                    keyboardType="numeric"
                                    value={values.quantity}
                                    onChangeText={(quantity) => setFieldValue('quantity', quantity)}
                                />
                            </XStack>
                            <XStack gap="$3" width="100%" alignItems="center">
                                <Label size="$2" htmlFor="name" flex={1}>
                                    Price/item
                                </Label>
                                <Input
                                    size="$3"
                                    flex={5}
                                    placeholder="Enter price (estimated) here..."
                                    keyboardType="numeric"
                                    value={values.price}
                                    onChangeText={(price) => setFieldValue('price', price)}
                                />
                            </XStack>

                            <XStack gap="$4" justifyContent="flex-end">
                                <Button
                                    minWidth={100}
                                    variant="outlined"
                                    borderWidth="$0.25"
                                    size="$3"
                                    onPress={() => {
                                        setOpenForm(false);
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
                    </Popover.Content>
                </Popover>
            )}
        </Formik>
    );
}
