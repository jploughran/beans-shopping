import { WINDOW_HEIGHT } from '@gorhom/bottom-sheet';
import { Formik } from 'formik';
import { H3, YStack } from 'tamagui';

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
                width: '65%',
            }}
            gap="$3"
        >
            <H3 marginTop="$4">Manage items for a store </H3>
            <Formik initialValues={{ store_id: undefined }} onSubmit={() => {}}>
                <StoreSelector />
            </Formik>
            <StoreItemTable />
        </YStack>
    );
}
