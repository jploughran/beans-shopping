import { FormikErrors, useFormikContext } from 'formik';
import { memo } from 'react';
import { Button, SizableText, View, YStack } from 'tamagui';

import { NewUserInfoUI } from '@/modules/authenticate';

const SubmitButton = () => {
    const { handleSubmit, errors, dirty } = useFormikContext<NewUserInfoUI>();
    const hasErrors = !!Object.keys(errors).length;
    return (
        <View>
            <Button
                marginTop="$3"
                size="$4"
                onPress={() => handleSubmit()}
                disabled={!dirty || hasErrors}
                opacity={hasErrors ? 0.7 : 1}
                color={hasErrors ? '$red7' : '$green10'}
                backgroundColor={hasErrors ? '$unset' : '$green1'}
            >
                Sign In
            </Button>
            <YStack marginTop="$3">
                {(Object.keys(errors) as (keyof FormikErrors<NewUserInfoUI>)[]).map(
                    (field: keyof FormikErrors<NewUserInfoUI>) => (
                        <SizableText key={field} size="$3" color="$red10">
                            {typeof errors[field] === 'string'
                                ? (errors[field] as string)
                                : JSON.stringify(errors?.[field])}
                        </SizableText>
                    ),
                )}
            </YStack>
        </View>
    );
};

export default memo(SubmitButton);
