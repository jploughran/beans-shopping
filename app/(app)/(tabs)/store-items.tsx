import EditStoreItems from '@/components/EditStoreItems';
import SimpleErrorBoundary from '@/components/SimpleErrorBoundary';

export default function TabTwoScreen() {
    return (
        <SimpleErrorBoundary location="EditStoreItems">
            <EditStoreItems />
        </SimpleErrorBoundary>
    );
}
