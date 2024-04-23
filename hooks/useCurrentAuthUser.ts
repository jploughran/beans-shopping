import { useEffect, useMemo, useState } from 'react';

export interface AuthUserState {
    username: string;
    userId: string;
}

export const useCurrentAuthenticatedUser = () => {
    const [userState, setUserState] = useState<AuthUserState>();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // const { username, userId, signInDetails } = await getCurrentUser();
                // console.log(`The username: ${username}`);
                // console.log(`The userId: ${userId}`);
                // console.log(`The signInDetails: ${signInDetails}`);
                // setUserState({ userId, username, signInDetails });
            } catch (err) {
                console.log(err);
            }
        };
    }, []);

    return useMemo(() => ({ userState }), []);
};
