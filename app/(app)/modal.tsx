import { StyleSheet } from 'react-native';

import { SignOutButton } from '@/components/SignOutButton';
import { View } from '@/components/Themed';

export default function ModalScreen() {
    return (
        <View style={styles.container}>
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
