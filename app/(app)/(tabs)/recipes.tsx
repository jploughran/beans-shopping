import { initialScreenStyles } from './previousTrips';

import { Text, View } from '@/components/Themed';

export default function TabTwoScreen() {
    return (
        <View style={initialScreenStyles.container}>
            <Text style={initialScreenStyles.title}>Coming soon...</Text>
            <View
                style={initialScreenStyles.separator}
                lightColor="#eee"
                darkColor="rgba(255,255,255,0.1)"
            />
        </View>
    );
}
