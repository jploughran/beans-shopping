import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';
import { SizableText } from 'tamagui';

import { SignOutButton } from '@/components/SignOutButton';
import { View } from '@/components/Themed';

export const APP_VERSION = Constants.expoConfig?.version;

export default function ModalScreen() {
    return (
        <View style={styles.container}>
            <SizableText marginBottom="$4">Version: {APP_VERSION}</SizableText>
            <SignOutButton />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
