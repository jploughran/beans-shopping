import Constants from 'expo-constants';
import { SizableText } from 'tamagui';
import { expo } from '../../app.json';

import { initialScreenStyles } from './(tabs)/previous-trips';

import { SignOutButton } from '@/components/SignOutButton';
import { View } from '@/components/Themed';

export const APP_VERSION = expo.version;

export default function ModalScreen() {
    return (
        <View style={initialScreenStyles.container}>
            <SizableText marginBottom="$4">Version: {APP_VERSION}</SizableText>
            <SignOutButton />
        </View>
    );
}
