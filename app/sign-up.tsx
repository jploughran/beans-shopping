import { router } from 'expo-router';
import { Formik } from 'formik';
import { memo, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { YStack, Spinner, SizableText, View, H3, Image, Button } from 'tamagui';
// import { useUserProviderContext } from '@/context-providers/UserProvider';

import logo from '@/assets/images/BeanLogo.png';
import FormField from '@/components/FormField';
import SubmitButton from '@/components/SubmitButton';
import { initialSignUpValues, newUserValidationSchema } from '@/modules/authenticate';
import { supabase } from '@/modules/supabase';

const SignUp = () => {
    // const { setUser } = useUserProviderContext();
    const [loading, setLoading] = useState(false);

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <View backgroundColor="$green3" style={styles.container}>
                <H3 marginBottom="$5">Bean Shopping</H3>
                <Image
                    src={logo}
                    style={{
                        height: 200,
                        width: 200,
                        borderRadius: 5,
                    }}
                />
                <Formik
                    initialValues={initialSignUpValues}
                    onSubmit={async ({ email, password }) => {
                        setLoading(true);
                        const {
                            data: { session },
                            error,
                        } = await supabase.auth.signUp({
                            email,
                            password,
                            options: {
                                emailRedirectTo: 'https://beans-shopping.vercel.app/emailConfirmed',
                            },
                        });

                        if (error) Alert.alert(error.message);
                        if (!session && !error) {
                            Alert.alert(
                                'Please check your inbox for email verification!',
                                undefined,
                                [{ text: 'Sign In', onPress: () => router.back() }],
                            );
                        }
                        setLoading(false);
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
                        {loading ? (
                            <>
                                <Spinner />
                                <SizableText>Please wait...</SizableText>
                            </>
                        ) : (
                            <>
                                <FormField placeholder="Enter email..." field="email" />
                                <FormField placeholder="Enter password..." field="password" />
                                <FormField
                                    placeholder="Confirm password..."
                                    field="confirmPassword"
                                />
                                <SubmitButton title="Sign Up" />
                                <Button
                                    borderWidth="$0.5"
                                    backgroundColor="$green2"
                                    size="$4"
                                    onPress={() => router.back()}
                                    variant="outlined"
                                >
                                    Back to Sign In
                                </Button>
                            </>
                        )}
                    </YStack>
                </Formik>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default memo(SignUp);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
});
