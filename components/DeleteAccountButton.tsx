import { Trash } from '@tamagui/lucide-icons';
import { memo, useCallback } from 'react';
import { Alert } from 'react-native';
import { Button } from 'tamagui';

import { useUserProviderContext } from '@/context-providers/UserProvider';
import { supabase } from '@/modules/supabase';
import { logError } from '@/utils/logging';

const DeleteFromListButton = () => {
    const { user } = useUserProviderContext();

    const handleDelete = useCallback(async () => {
        console.log({ id: user?.id });
        Alert.alert(
            'Are you sure you want to delete your user?',
            'This will permanently delete your user and all data associated with it',
            [
                {
                    text: 'Delete Account',
                    onPress: async () => {
                        if (user?.id) {
                            await supabase.rpc('delete_user').then((response) => {
                                const { data, error } = response;
                                if (!error) {
                                    supabase.auth.signOut();
                                } else {
                                    console.log('Error deleting user:', error.message, {
                                        data,
                                        error,
                                    });
                                    logError(error);
                                }
                            });
                        }
                    },
                    style: 'destructive',
                },
                {
                    text: 'Cancel',

                    style: 'cancel',
                },
            ],
        );
    }, [user?.id]);

    return (
        <Button
            alignItems="center"
            icon={<Trash color="$red10" />}
            onPress={handleDelete}
            backgroundColor="$red4"
            marginBottom="$4"
            maxWidth="$15"
        >
            Delete Account
        </Button>
    );
};

export default memo(DeleteFromListButton);
