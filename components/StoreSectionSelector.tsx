import { Check, ChevronDown } from '@tamagui/lucide-icons';
import { useField } from 'formik';
import { memo, useMemo } from 'react';
import type { SelectProps } from 'tamagui';
import { Adapt, Select, Sheet, XStack } from 'tamagui';

import InputLabel from './InputLabel';

import { STORE_SECTIONS, StoreSection } from '@/types/list';

export function StoreSectionSelector() {
    return (
        <XStack ai="center" w="100%" justifyContent="space-between">
            <InputLabel label="Section" />
            <SectionSelect id="select-demo-1" />
        </XStack>
    );
}
const SectionSelect = (props: SelectProps) => {
    const [{ value: storeSection }, , { setValue: setStoreSection }] =
        useField<StoreSection>('store_section');

    return (
        <Select
            value={storeSection}
            onValueChange={(value) => setStoreSection(value as StoreSection)}
            disablePreventBodyScroll
            {...props}
        >
            <Select.Trigger iconAfter={ChevronDown} style={{ flex: 5 }}>
                <Select.Value placeholder="Miscellaneous" />
            </Select.Trigger>
            <Adapt>
                <Sheet
                    native
                    modal
                    dismissOnSnapToBottom
                    animationConfig={{
                        type: 'spring',
                        damping: 20,
                        mass: 1.2,
                        stiffness: 250,
                    }}
                >
                    <Sheet.Frame>
                        <Sheet.ScrollView>
                            <Adapt.Contents />
                        </Sheet.ScrollView>
                    </Sheet.Frame>

                    <Sheet.Overlay
                        animation="lazy"
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                    />
                </Sheet>
            </Adapt>
            <Select.Content zIndex={200000}>
                <Select.Viewport minWidth={200}>
                    <Select.Group>
                        <Select.Label>Store Sections</Select.Label>
                        <SectionOptions />
                    </Select.Group>
                </Select.Viewport>
            </Select.Content>
        </Select>
    );
};

export default memo(StoreSectionSelector);

const SectionOptions = () => {
    return useMemo(
        () =>
            STORE_SECTIONS.map((item, i) => {
                return (
                    <Select.Item index={i} key={item} value={item}>
                        <Select.ItemText>{item}</Select.ItemText>

                        <Select.ItemIndicator marginLeft="auto">
                            <Check size={16} />
                        </Select.ItemIndicator>
                    </Select.Item>
                );
            }),

        [],
    );
};
