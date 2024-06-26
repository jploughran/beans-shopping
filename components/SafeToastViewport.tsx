import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ToastViewport } from '@tamagui/toast';
export const SafeToastViewport = () => {
    const { left, top, right } = useSafeAreaInsets();

    return <ToastViewport flexDirection="column-reverse" top={top} left={left} right={right} />;
};
