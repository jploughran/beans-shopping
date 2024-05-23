import { useBottomSheetInternal } from '@gorhom/bottom-sheet';
import { useField } from 'formik';
import { memo } from 'react';
import { KeyboardTypeOptions } from 'react-native';
import { Input } from 'tamagui';

import { InitialListItemFormValue } from '@/modules/add-list-item-validation';

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
    const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

    return (
        <Input
            size="$3"
            flex={4}
            placeholder={placeholder}
            keyboardType={keyboardType}
            value={value}
            onChangeText={(price) => setValue(price)}
            onFocus={() => {
                shouldHandleKeyboardEvents.value = true;
            }}
            onBlur={() => {
                shouldHandleKeyboardEvents.value = false;
            }}
        />
    );
};

export default memo(InputField);
