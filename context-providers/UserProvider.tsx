import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import invariant from 'tiny-invariant';

export interface UserProviderContextValues {
    user: any | null;
    setUser: React.Dispatch<React.SetStateAction<any | null>>;
}

export const UserProviderContext = createContext<UserProviderContextValues | null>(null);

export const UserProvider = ({
    children,
}: Record<string, unknown> & {
    children?: ReactNode;
}) => {
    const [user, setUser] = useState<any | null>(null);

    const contextValue: UserProviderContextValues = useMemo(() => {
        return { user, setUser };
    }, [user, setUser]);

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
        userIdToken: useUserProviderContext().user?.getIdToken().getJwtToken(),
    };
};
