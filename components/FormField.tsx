import { useField } from 'formik';
import { memo } from 'react';
import { Input } from 'tamagui';
interface Props {
    field: string;
    placeholder: string;
}
const FormField = ({ field, placeholder }: Props) => {
    const [{ value: fieldValue }, { error }, { setValue: setFieldValue, setTouched }] =
        useField<string>(field);
    return (
        <Input
            marginVertical="$1.5"
            size="$3"
            flex={1}
            autoCapitalize="none"
            placeholder={placeholder}
            keyboardType="default"
            value={fieldValue}
            onChangeText={(value) => {
                setTouched(true);
                setFieldValue(value);
            }}
        />
    );
};

export default memo(FormField);
