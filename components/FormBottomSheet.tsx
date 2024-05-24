import BottomSheet, { BottomSheetProps } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { memo } from 'react';
import { Keyboard } from 'react-native';

import { useBottomSheetProviderContext } from '@/context-providers/BottomSheetProvider';

const FormBottomSheet = ({
    children,
}: BottomSheetProps & React.RefAttributes<BottomSheetMethods>) => {
    const { sheetRef } = useBottomSheetProviderContext();

    return (
        <BottomSheet
            ref={sheetRef}
            index={-1}
            snapPoints={['65%', '98%']}
            enablePanDownToClose
            keyboardBlurBehavior="restore"
            keyboardBehavior="extend"
            onClose={() => {
                Keyboard.dismiss();
            }}
        >
            {children}
        </BottomSheet>
    );
};
export default memo(FormBottomSheet);
