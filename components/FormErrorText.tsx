import { FormikErrors } from 'formik';
import { memo } from 'react';
import { YStack, SizableText } from 'tamagui';

interface Props<T extends object> {
    errors: FormikErrors<T>;
}
function FormErrorText<T extends object>({ errors }: Props<T>) {
    return (
        <YStack marginTop="$3">
            {(Object.keys(errors) as (keyof FormikErrors<T>)[]).map(
                (field: keyof FormikErrors<T>) => (
                    <SizableText key={field as string} size="$3" color="$red10">
                        {typeof errors[field] === 'string'
                            ? (errors[field] as string)
                            : JSON.stringify(errors?.[field])}
                    </SizableText>
                ),
            )}
        </YStack>
    );
}

export default memo(FormErrorText);
