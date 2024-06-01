import { WINDOW_HEIGHT } from '@gorhom/bottom-sheet';
import { Formik } from 'formik';
import { H5, Separator, SizableText, YStack } from 'tamagui';

import StoreItemTable from './StoreItemTable';
import StoreSelector from './StoreSelector';

export default function EditStoreItems() {
    return (
        <YStack
            margin="$4"
            marginTop="$2"
            height={WINDOW_HEIGHT}
            flex={1}
            $gtSm={{
                alignSelf: 'center',
                width: '75%',
            }}
        >
            <H5 marginVertical="$4" alignSelf="center">
                Manage Store Items
            </H5>
            <SizableText>Select Store</SizableText>
            <Separator marginVertical="$4" />
            <Formik initialValues={{ store_id: undefined }} onSubmit={() => {}}>
                <StoreSelector />
            </Formik>
            <Separator marginVertical="$4" />
            <StoreItemTable />
        </YStack>
    );
}
