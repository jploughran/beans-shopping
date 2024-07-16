import { SizableText, YStack } from 'tamagui';

import { expo } from '../../app.json';

import DeleteAccountButton from '@/components/DeleteAccountButton';
import { SignOutButton } from '@/components/SignOutButton';
import { useUserProviderContext } from '@/context-providers/UserProvider';

export const APP_VERSION = expo.version;

export default function ModalScreen() {
    const { session } = useUserProviderContext();
    return (
        <YStack flex={1} ai="center" jc="space-evenly">
            <YStack ai="center">
                <SizableText marginBottom="$4">User: {session?.user.email}</SizableText>
                <SizableText marginBottom="$4">Version: {APP_VERSION}</SizableText>
                <SignOutButton />
            </YStack>
            <YStack ai="center">
                <SizableText marginBottom="$4">Would you like to delete your account?</SizableText>
                <DeleteAccountButton />
            </YStack>
        </YStack>
    );
}
