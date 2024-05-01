import { memo } from 'react';
import { Card, H2, Paragraph } from 'tamagui';

import { List } from '@/types/list';
interface Props {
    list: List;
}
const UserListCard = ({ list }: Props) => {
    return (
        <Card
            elevate
            size="$4"
            bordered
            animation="bouncy"
            width={250}
            height={300}
            scale={0.9}
            hoverStyle={{ scale: 0.925 }}
            pressStyle={{ scale: 0.875 }}
        >
            <Card.Header padded>
                <H2>{list.list_name}</H2>
                <Paragraph theme="alt2">{list.created_at}</Paragraph>
            </Card.Header>
        </Card>
    );
};

export default memo(UserListCard);
