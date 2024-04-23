import { Button } from 'tamagui';

// retrieves only the current value of 'user' from 'useAuthenticator'
const userSelector = (context: any) => [context.user];

export const SignOutButton = () => {
    return (
        <Button onPress={() => {}} size="$3" variant="outlined">
            Log Out
        </Button>
    );
};
