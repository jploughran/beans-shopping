import { StyleSheet } from 'react-native';

import { Text } from '@/components/Themed';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View } from 'tamagui';

export default function TabOneScreen() {
    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <View>
                <Text style={styles.title}>Tab One</Text>
                <View style={styles.separator} backgroundColor={'$green12'} />
            </View>
        </KeyboardAwareScrollView>
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
