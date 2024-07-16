import { Session, User } from '@supabase/supabase-js';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import invariant from 'tiny-invariant';

import { supabase } from '@/modules/supabase';
import { logError } from '@/utils/logging';

export interface UserProviderContextValues {
    session: Session | null;
    user: User | null;
}

export const UserProviderContext = createContext<UserProviderContextValues | null>(null);

export const UserProvider = ({
    children,
}: Record<string, unknown> & {
    children?: ReactNode;
}) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const getSessions = async () => {
            await supabase.auth
                .getSession()
                .then(({ data: { session } }) => {
                    setSession(session);
                })
                .catch((e) => {
                    console.log('error in auth.getSession()', { e });
                });
        };
        const getUser = async () => {
            await supabase.auth.getUser().then((user) => {
                const { data, error } = user;
                if (data.user) {
                    setUser(data.user);
                } else {
                    logError(error);
                }
            });
        };
        Promise.all([getSessions(), getUser()]);

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    const contextValue: UserProviderContextValues = useMemo(() => {
        return { session, user };
    }, [session, user]);

    return (
        <UserProviderContext.Provider value={contextValue}>{children}</UserProviderContext.Provider>
    );
};

export const useUserProviderContext = () => {
    const ctx = useContext(UserProviderContext);

    invariant(ctx, 'useUserProviderContext called outside of UserProviderContext');

    return ctx;
};

export const useUserToken = () => {
    return {
        userAccessToken: useUserProviderContext().session?.access_token,
    };
};
