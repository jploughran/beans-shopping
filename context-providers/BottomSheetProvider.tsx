import BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import invariant from 'tiny-invariant';

export interface BottomSheetProviderContextValues {
    handleOpenPress: () => void;
    handleClosePress: () => void;
    sheetRef: React.RefObject<BottomSheetMethods>;
}

export const BottomSheetProviderContext = createContext<BottomSheetProviderContextValues | null>(
    null,
);

export const BottomSheetProvider = ({
    children,
}: Record<string, unknown> & {
    children?: React.ReactNode;
}) => {
    const sheetRef = useRef<BottomSheet>(null);

    const handleOpenPress = useCallback(() => {
        console.log('handleOpenPress called');
        sheetRef.current?.expand();
    }, []);

    const handleClosePress = useCallback(() => {
        console.log('handleClosePress called');
        sheetRef.current?.close();
    }, []);

    const contextValue: BottomSheetProviderContextValues = useMemo(() => {
        return {
            sheetRef,
            handleOpenPress,
            handleClosePress,
        };
    }, [handleClosePress, handleOpenPress]);

    return (
        <BottomSheetProviderContext.Provider value={contextValue}>
            {children}
        </BottomSheetProviderContext.Provider>
    );
};

export const useBottomSheetProviderContext = () => {
    const ctx = useContext(BottomSheetProviderContext);

    invariant(ctx, 'useBottomSheetProviderContext called outside of BottomSheetProviderContext');

    return ctx;
};
