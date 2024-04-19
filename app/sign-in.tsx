import {
    authenticateUser,
    initialLoginValues,
    loginValidationSchema,
} from '@/modules/authenticate';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Formik } from 'formik';
import { memo } from 'react';
import { Button, H3, Image, Label, SizableText, View, XStack, YStack } from 'tamagui';
import FormField from '../components/FormField';
import SubmitButton from '../components/SubmitButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useUserProviderContext } from '@/context-providers/UserProvider';
import { Toast, useToastController, useToastState } from '@tamagui/toast';

import logo from '@/assets/images/BeanLogo.png';
import { themes } from '@/constants/theme';

const SignIn = () => {
    const { setUser } = useUserProviderContext();
    const toast = useToastController();
    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <View backgroundColor={'$green3'} style={styles.container}>
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
                    initialValues={initialLoginValues}
                    onSubmit={async (values) => {
                        await authenticateUser(values.email, values.password)
                            .then((userSession) => {
                                setUser(userSession);
                                toast.show('Signed In!', { duration: 1500 });
                                router.push('/(app)/(tabs)/');
                            })
                            .catch((e) => {
                                toast.show('Error signing in...!', {
                                    message: `${e}`,
                                    duration: 1500,
                                });
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
                            <Label htmlFor="sign-up">New?</Label>
                            <Button
                                size="$3"
                                variant="outlined"
                                onPress={() => router.push('/sign-up')}
                            >
                                Sign Up Now
                            </Button>
                        </XStack>
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
