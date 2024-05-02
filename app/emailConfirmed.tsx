import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { H3, Image, SizableText, View } from 'tamagui';

import logo from '@/assets/images/BeanLogo.png';

const EmailConfirmed = () => {
    return (
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
            <SizableText marginTop="$10">Email confirmed! Please proceed to sign in.</SizableText>
        </View>
    );
};

export default memo(EmailConfirmed);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
});
