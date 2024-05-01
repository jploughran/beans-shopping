import { List, Receipt, Salad, Settings } from '@tamagui/lucide-icons';
import { Link, Tabs } from 'expo-router';
import React from 'react';
import { Button } from 'tamagui';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                // Disable the static render of the header on web
                // to prevent a hydration error in React Navigation v6.
                headerShown: useClientOnlyValue(false, true),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Lists',
                    tabBarIcon: ({ color }) => <List color={color} />,
                    headerRight: () => (
                        <Link href="/modal" asChild>
                            <Button icon={<Settings size="$1" />} chromeless marginRight="$0.25" />
                        </Link>
                    ),
                }}
            />
            <Tabs.Screen
                name="two"
                options={{
                    title: 'Recipes',
                    tabBarIcon: ({ color }) => <Salad color={color} />,
                }}
            />
            <Tabs.Screen
                name="three"
                options={{
                    title: 'Previous Trips',
                    tabBarIcon: ({ color }) => <Receipt color={color} />,
                }}
            />
        </Tabs>
    );
}
