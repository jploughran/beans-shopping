import { Toast, useToastState } from '@tamagui/toast';
import { Redirect, router } from 'expo-router';
import { Formik } from 'formik';
import { memo, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, H2, H3, Image, Label, SizableText, Spinner, View, XStack, YStack } from 'tamagui';

import FormField from '../components/FormField';
import SubmitButton from '../components/SubmitButton';

import logo from '@/assets/images/BeanLogo.png';
import { useUserProviderContext } from '@/context-providers/UserProvider';
import { initialLoginValues, loginValidationSchema } from '@/modules/authenticate';
import { supabase } from '@/modules/supabase';

const SignIn = () => {
    const [loading, setLoading] = useState(false);
    const { session } = useUserProviderContext();
    if (session) {
        return <Redirect href="(app)/(tabs)/" />;
    }
    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <View backgroundColor="$green3" style={styles.container}>
                <H2 marginBottom="$5">Bean Shopping</H2>
                <Image
                    src={logo}
                    style={{
                        height: 210,
                        width: 210,
                        borderRadius: 7,
                    }}
                />
                <Formik
                    initialValues={initialLoginValues}
                    onSubmit={async ({ email, password }) => {
                        setLoading(true);
                        const { error } = await supabase.auth.signInWithPassword({
                            email,
                            password,
                        });
                        if (error) {
                            Alert.alert(error.message);
                        } else {
                            router.push('/(app)/(tabs)/');
                        }
                        setLoading(false);
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
                        {loading ? (
                            <>
                                <Spinner />
                                <SizableText>Please wait...</SizableText>
                            </>
                        ) : (
                            <>
                                <FormField placeholder="Enter email..." field="email" />
                                <FormField placeholder="Enter password..." field="password" />
                                <SubmitButton />
                                <XStack
                                    gap="$2"
                                    justifyContent="center"
                                    marginTop="$5"
                                    alignItems="center"
                                >
                                    <Label htmlFor="sign-up">New?</Label>
                                    <Button
                                        size="$3"
                                        variant="outlined"
                                        borderWidth="$0.5"
                                        backgroundColor="$green2"
                                        onPress={() => router.push('/sign-up')}
                                    >
                                        Sign Up Now
                                    </Button>
                                </XStack>
                            </>
                        )}
                        <CurrentToast />
                    </YStack>
                </Formik>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default memo(SignIn);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
});

const CurrentToast = () => {
    const currentToast = useToastState();

    if (!currentToast || currentToast.isHandledNatively) return null;
    return (
        <Toast
            key={currentToast.id}
            duration={currentToast.duration}
            enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
            exitStyle={{ opacity: 0, scale: 1, y: -20 }}
            y={0}
            opacity={1}
            scale={1}
            animation="100ms"
            viewportName={currentToast.viewportName}
        >
            <YStack>
                <Toast.Title>{currentToast.title}</Toast.Title>
                {!!currentToast.message && (
                    <Toast.Description>{currentToast.message}</Toast.Description>
                )}
            </YStack>
        </Toast>
    );
};
