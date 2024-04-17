import {
    authenticateUser,
    initialLoginValues,
    loginValidationSchema,
} from '@/modules/authenticate';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Formik } from 'formik';
import { memo } from 'react';
import { Button, Label, XStack, YStack } from 'tamagui';
import FormField from '../components/FormField';
import SubmitButton from '../components/SubmitButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useUserProviderContext } from '@/context-providers/UserProvider';
import { useToastController } from '@tamagui/toast';

const SignIn = () => {
    const { setUser } = useUserProviderContext();
    const toast = useToastController();
    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <Formik
                initialValues={initialLoginValues}
                onSubmit={async (values) => {
                    await authenticateUser(values.email, values.password).then((userSession) => {
                        setUser(userSession);
                        toast.show('Signed In!');
                    });
                }}
                validateOnChange
                validationSchema={loginValidationSchema}
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
                    <SubmitButton />
                    <XStack gap="$2" justifyContent="center" marginTop="$5" alignItems="center">
                        <Label htmlFor="sign-up">New User?</Label>
                        <Button
                            size="$3"
                            variant="outlined"
                            onPress={() => router.push('/sign-up')}
                        >
                            Sign Up Now
                        </Button>
                    </XStack>
                </YStack>
            </Formik>
        </KeyboardAwareScrollView>
    );
};

export default memo(SignIn);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
    },
});
