import { router } from 'expo-router';
import React from 'react';
import { Button, H1, H4, H5, SizableText, YStack } from 'tamagui';

const WelcomeScreen: React.FC = () => {
    const navigateToSignIn = () => {
        router.push('/sign-in');
    };

    return (
        <YStack jc="space-between" flex={1} backgroundColor="$green1" p="$5" pt="$10">
            <H4 als="center">Welcome to Beans Shopping!</H4>
            <SizableText>This app helps you find and purchase your favorite beans.</SizableText>
            <Button onPress={navigateToSignIn}>Sign In</Button>
        </YStack>
    );
};

export default WelcomeScreen;
