import * as Sentry from '@sentry/react-native';
import { User } from '@supabase/supabase-js';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { getUniqueIdSync } from 'react-native-device-info';

import { expo } from '../app.json';

export const APP_VERSION = expo.version || Application.nativeApplicationVersion;

export const RELEASE_CHANNEL =
    (Constants.expoConfig || Constants.manifest2)?.extra?.expoClient?.releaseChannel ||
    Updates.channel ||
    Updates.releaseChannel;

export const BUILD_NUMBER =
    Application.nativeBuildVersion === APP_VERSION ? '' : Application.nativeBuildVersion;

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
export const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

export const updateLoggedUser = (user: User | null) => {
    if (user) {
        const newUser: Sentry.User = { id: user.id, email: user.email };
        Sentry.setUser(newUser);
    } else {
        Sentry.setUser(user);
    }
};

export type BreadcrumbCategory =
    | 'analytics'
    | 'api'
    | 'auth'
    | 'supabase'
    | 'general'
    | 'navigation'
    | 'notifications'
    | 'supabase-utils'
    | 'utils';

export const breadcrumb = (message: string, category: BreadcrumbCategory, data?: any) => {
    if (__DEV__) {
        // console.log(`BREADCRUMB [${category}]: ${message}
        //     ${JSON.stringify(data)}`);
    } else {
        Sentry.addBreadcrumb({
            category,
            message,
            level: getSeverity(3),
            data,
        });
    }
};

export const log = (message: string, data?: any, throttleAtOneInXRate = 1) => {
    const logRate = isLoggingWithinThrottleRate(throttleAtOneInXRate);
    if (__DEV__) {
        console.log(`LOG: ${message}`, data);
    } else if (logRate) {
        if (data) {
            breadcrumb(message, 'general', { ...data, logRate });
        }

        const severity = getSeverity(3);
        Sentry.captureMessage(message, severity);
    }
};

export const logWarn = (message: string, throttleAtOneInXRate = 1) => {
    const logRate = isLoggingWithinThrottleRate(throttleAtOneInXRate);
    if (__DEV__) {
        console.warn(message);
    } else if (logRate) {
        const severity = getSeverity(2);
        Sentry.captureMessage(message, severity);
    }
};

export const logError = (error: Error | unknown, throttleAtOneInXRate = 1) => {
    const logRate = isLoggingWithinThrottleRate(throttleAtOneInXRate);
    if (error instanceof Error) {
        if (__DEV__) {
            console.warn(`ERROR logged: ${error.message}`);
        } else if (logRate) {
            Sentry.captureException(error);
        }
    } else if (logRate) {
        log(`log error type mismatch `, { type: typeof error });
    }
};

const getSeverity = (level: number) => {
    switch (level) {
        case 1:
            return 'error';
        case 2:
            return 'warning';
        default:
            return 'info';
    }
};

export const initializeSentry = () => {
    console.log(`__DEV__: ${__DEV__}`);

    Sentry.init({
        dsn: 'https://a43a1d052e1f2b2cfb8f01d056698764@o4507539175374848.ingest.us.sentry.io/4507539208667136',
        enableAutoPerformanceTracing: true,
        enableAutoSessionTracking: true,
        environment: 'production',
        // Sessions close after app is 10 seconds in the background.
        sessionTrackingIntervalMillis: 10000,
        tracesSampleRate: 0.5,
        _experiments: {
            // profilesSampleRate is relative to tracesSampleRate.
            // Here, we'll capture profiles for 100% of transactions.
            profilesSampleRate: 1.0,
        },
    });

    Sentry.setTag('RNDeviceId', getUniqueIdSync());
    Sentry.setTag('expoUpdateVersion', APP_VERSION);
};

const isLoggingWithinThrottleRate = (throttleAtOneInXRate: number): false | string => {
    if (
        throttleAtOneInXRate &&
        throttleAtOneInXRate >= 1 &&
        Date.now() % throttleAtOneInXRate === 0
    ) {
        return `[1/${throttleAtOneInXRate}]`;
    } else {
        return false;
    }
};
