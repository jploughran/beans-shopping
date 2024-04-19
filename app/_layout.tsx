// import '../tamagui-web.css';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider, Theme as NavTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { TamaguiProvider, Theme } from 'tamagui';

import { tamaguiConfig } from '../tamagui.config';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import cognitoUserPool from '@/modules/cognitoUserPool';
import { UserProvider } from '@/context-providers/UserProvider';
import { ToastProvider } from '@tamagui/toast';
import { SafeToastViewport } from '@/components/SafeToastViewport';

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

    const user = cognitoUserPool.getCurrentUser();

    console.log({ user });

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
        <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme as string | undefined}>
            <SafeAreaProvider>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : LightTheme}>
                    <Theme name={'green'}>
                        <UserProvider>
                            <ToastProvider>
                                <Slot />
                                <SafeToastViewport />
                            </ToastProvider>
                        </UserProvider>
                    </Theme>
                </ThemeProvider>
            </SafeAreaProvider>
        </TamaguiProvider>
    );
}

const LightTheme: NavTheme = {
    dark: false,
    colors: {
        primary: 'rgb(101, 186, 117)',
        background: 'rgb(251, 254, 251)',
        card: 'rgb(235, 249, 235)',
        text: 'rgb(28, 28, 30)',
        border: 'rgb(183, 223, 186)',
        notification: 'rgb(255, 59, 48)',
    },
};

const DarkTheme: NavTheme = {
    dark: true,
    colors: {
        primary: 'rgb(85, 180, 103)',
        background: 'rgb(22, 48, 29)',
        card: 'rgb(29, 68, 39)',
        text: 'rgb(251, 254, 251)',
        border: 'rgb(101, 186, 117)',
        notification: 'rgb(255, 59, 48)',
    },
};
