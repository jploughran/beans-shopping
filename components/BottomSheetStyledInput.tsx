import React, { memo, useCallback, forwardRef, useEffect } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { useBottomSheetInternal } from '@gorhom/bottom-sheet';
import { Input } from 'tamagui';
import { BottomSheetTextInputProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

const BottomSheetTextInputComponent = forwardRef<typeof TextInput, BottomSheetTextInputProps>(
    ({ onFocus, onBlur, ...rest }, ref) => {
        //#region hooks
        const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

        useEffect(() => {
            return () => {
                // Reset the flag on unmount
                shouldHandleKeyboardEvents.value = false;
            };
        }, [shouldHandleKeyboardEvents]);
        //#endregion

        //#region callbacks
        const handleOnFocus = useCallback(
            (args) => {
                shouldHandleKeyboardEvents.value = true;
                if (onFocus) {
                    onFocus(args);
                }
            },
            [onFocus, shouldHandleKeyboardEvents],
        );
        const handleOnBlur = useCallback(
            (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
                shouldHandleKeyboardEvents.value = false;
                if (onBlur) {
                    onBlur(args);
                }
            },
            [onBlur, shouldHandleKeyboardEvents],
        );
        //#endregion

        return <Input ref={ref} onFocus={handleOnFocus} onBlur={handleOnBlur} {...rest} />;
    },
);

const BottomSheetTextInput = memo(BottomSheetTextInputComponent);
BottomSheetTextInput.displayName = 'BottomSheetTextInput';

export default BottomSheetTextInput;
