import { StyleProp, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle, FadeIn, FadeOut } from 'react-native-reanimated';
import { SizableText, Spinner } from 'tamagui';

interface Props {
    loading: boolean;
    children: JSX.Element;
    message?: string;
    style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}
export default function LoadingView({ children, loading, message = 'Loading...', style }: Props) {
    if (loading) {
        return (
            <Animated.View
                style={[
                    {
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    style,
                ]}
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
            >
                <Spinner size="large" color="$green10" />
                <SizableText size="$6" marginTop="$6">
                    {message}
                </SizableText>
            </Animated.View>
        );
    } else return children;
}
