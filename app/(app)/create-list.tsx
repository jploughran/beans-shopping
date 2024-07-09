import AddListForm from '@/components/AddListForm';
import SimpleErrorBoundary from '@/components/SimpleErrorBoundary';

export default function CreateList() {
    return (
        <SimpleErrorBoundary location="AddListForm">
            <AddListForm />
        </SimpleErrorBoundary>
    );
}
