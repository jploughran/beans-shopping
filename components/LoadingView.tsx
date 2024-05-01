import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { SizableText, Spinner } from 'tamagui';

interface Props {
    loading: boolean;
    children: JSX.Element;
    message?: string;
}
export default function LoadingView({ children, loading, message = 'Loading...' }: Props) {
    if (loading) {
        return (
            <Animated.View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                }}
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
