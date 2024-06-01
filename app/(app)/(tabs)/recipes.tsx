import { WINDOW_HEIGHT } from '@gorhom/bottom-sheet';
import { SizableText, YStack } from 'tamagui';

export default function TabTwoScreen() {
    return (
        <YStack
            margin="$4"
            marginTop="$2"
            height={WINDOW_HEIGHT}
            flex={1}
            $gtSm={{
                alignSelf: 'center',
                width: '75%',
            }}
        >
            <SizableText>Coming soon...</SizableText>
        </YStack>
    );
}
