import { memo } from 'react';
import { Label, LabelProps } from 'tamagui';

interface Props extends LabelProps {
    label: string;
}

const InputLabel = (props: Props) => {
    return (
        <Label size="$2" width="$4" htmlFor="name" flex={1} {...props}>
            {props.label}
        </Label>
    );
};

export default memo(InputLabel);
