import Constants from 'expo-constants';
import { SizableText } from 'tamagui';

import { initialScreenStyles } from './(tabs)/previousTrips';

import { SignOutButton } from '@/components/SignOutButton';
import { View } from '@/components/Themed';

export const APP_VERSION = Constants.expoConfig?.version;

export default function ModalScreen() {
    return (
        <View style={initialScreenStyles.container}>
            <SizableText marginBottom="$4">Version: {APP_VERSION}</SizableText>
            <SignOutButton />
        </View>
    );
}
