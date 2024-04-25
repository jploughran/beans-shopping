import { useField } from 'formik';
import { memo } from 'react';
import { Input, SizableText, YStack } from 'tamagui';
interface Props {
    field: string;
    placeholder: string;
}
const FormField = ({ field, placeholder }: Props) => {
    const [{ value: fieldValue }, { error }, { setValue: setFieldValue, setTouched }] =
        useField<string>(field);
    return (
        <YStack minHeight={50} gap="$2">
            <Input
                minHeight={40}
                marginVertical="$1.5"
                color={'$green10'}
                size="$3"
                flex={1}
                autoCapitalize="none"
                secureTextEntry={field === ('password' || 'confirmPassword')}
                placeholder={placeholder}
                inputMode={field === 'email' ? 'email' : 'text'}
                value={fieldValue}
                onChangeText={(value) => {
                    setTouched(true);
                    setFieldValue(value);
                }}
            />
        </YStack>
    );
};

export default memo(FormField);
