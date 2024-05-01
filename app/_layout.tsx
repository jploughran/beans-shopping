import '../tamagui-web.css';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider, Theme as NavTheme } from '@react-navigation/native';
import { ToastProvider } from '@tamagui/toast';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { TamaguiProvider, Theme } from 'tamagui';

import { tamaguiConfig } from '../tamagui.config';

// import { UserProvider } from '@/context-providers/UserProvider';
import { SafeToastViewport } from '@/components/SafeToastViewport';
import { UserProvider } from '@/context-providers/UserProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
        InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
        ...FontAwesome.font,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return <RootLayoutNav />;
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <TamaguiProvider
                config={tamaguiConfig}
                defaultTheme={colorScheme as string | undefined}
            >
                <ThemeProvider value={LightTheme}>
                    <Theme name="green">
                        <UserProvider>
                            <ToastProvider>
                                <Slot />
                                <SafeToastViewport />
                            </ToastProvider>
                        </UserProvider>
                    </Theme>
                </ThemeProvider>
            </TamaguiProvider>
        </GestureHandlerRootView>
    );
}

const LightTheme: NavTheme = {
    dark: false,
    colors: {
        primary: 'rgb(101, 186, 117)',
        background: 'rgb(251, 254, 251)',
        card: 'rgb(183, 223, 186)',
        text: 'rgb(28, 28, 30)',
        border: 'rgb(183, 223, 186)',
        notification: 'rgb(255, 59, 48)',
    },
};

// const DarkTheme: NavTheme = {
//     dark: true,
//     colors: {
//         primary: 'rgb(85, 180, 103)',
//         background: 'rgb(22, 48, 29)',
//         card: 'rgb(29, 68, 39)',
//         text: 'rgb(251, 254, 251)',
//         border: 'rgb(101, 186, 117)',
//         notification: 'rgb(255, 59, 48)',
//     },
// };
