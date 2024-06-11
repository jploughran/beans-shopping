import { SizableText, Spinner, View } from 'tamagui';

interface Props {
    loading: boolean;
    children: JSX.Element;
    message?: string;
}
export default function LoadingView({ children, loading, message = 'Loading...' }: Props) {
    if (loading) {
        return (
            <View
                style={[
                    {
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                ]}
            >
                <Spinner size="large" color="$green10" />
                <SizableText size="$6" marginTop="$6">
                    {message}
                </SizableText>
            </View>
        );
    } else return children;
}
