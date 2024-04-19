import {
    authenticateUser,
    initialSignUpValues,
    newUserValidationSchema,
    signUpUser,
} from '@/modules/authenticate';
import { Formik } from 'formik';
import { memo } from 'react';
import { YStack } from 'tamagui';
import FormField from './FormField';
import SubmitButton from './SubmitButton';
import { useUserProviderContext } from '@/context-providers/UserProvider';
import { router } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StyleSheet } from 'react-native';

const SignUp = () => {
    const { setUser } = useUserProviderContext();
    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <Formik
                initialValues={initialSignUpValues}
                onSubmit={async (values, formikHelpers) => {
                    await signUpUser(values.email, values.password).then((user) => {
                        setUser(user);
                        router.push('/(tabs)/');
                    });
                }}
                validateOnChange
                validationSchema={newUserValidationSchema}
            >
                <YStack
                    width={250}
                    minHeight={250}
                    overflow="hidden"
                    gap="$2"
                    margin="$3"
                    padding="$2"
                >
                    <FormField placeholder="Enter email..." field="email" />
                    <FormField placeholder="Enter password..." field="password" />
                    <FormField placeholder="Confirm password..." field="confirmPassword" />
                    <SubmitButton />
                </YStack>
            </Formik>
        </KeyboardAwareScrollView>
    );
};

export default memo(SignUp);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
