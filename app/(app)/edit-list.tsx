import EditList from '@/components/EditList';
import SimpleErrorBoundary from '@/components/SimpleErrorBoundary';

export default () => {
    return (
        <SimpleErrorBoundary location="EditList">
            <EditList />
        </SimpleErrorBoundary>
    );
};
