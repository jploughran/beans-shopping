import Lists from '@/components/Lists';
import SimpleErrorBoundary from '@/components/SimpleErrorBoundary';

export default function TabOneScreen() {
    return (
        <SimpleErrorBoundary location="Lists">
            <Lists />
        </SimpleErrorBoundary>
    );
}
