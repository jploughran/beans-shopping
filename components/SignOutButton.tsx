import { Button } from 'tamagui';

import { supabase } from '@/modules/supabase';

// retrieves only the current value of 'user' from 'useAuthenticator'

export const SignOutButton = () => {
    return (
        <Button
            onPress={async () => {
                await supabase.auth.signOut();
            }}
            size="$3"
            variant="outlined"
        >
            Log Out
        </Button>
    );
};
