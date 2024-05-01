import { useFormikContext } from 'formik';
import { memo } from 'react';
import { Button, View } from 'tamagui';

import FormErrorText from './FormErrorText';

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
            <FormErrorText errors={errors} />
        </View>
    );
};

export default memo(SubmitButton);
