import * as Updates from 'expo-updates';
import { Component, ErrorInfo } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { H3, H4, SizableText, XStack, YStack } from 'tamagui';

import { logError } from '@/utils/logging';

export type ErrorType = string | { message?: string; statusCode?: string };

export const stringFromError = (error: unknown): string => {
    const e = error as ErrorType;
    if (typeof e === 'string') {
        return e;
    } else if (typeof e?.message === 'string') {
        return e.message;
    } else if (typeof e?.statusCode === 'string') {
        return e.statusCode;
    } else {
        return `[stringFromError] unrecognized error object shape, message: ${typeof e?.message}`;
    }
};

interface Props {
    children: JSX.Element | (JSX.Element | null)[];
    location: string;
}
interface State {
    error: Error | null;
    errorInfo: null | ErrorInfo;
}
export default class SimpleErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error: Error | null, errorInfo: ErrorInfo) {
        // Catch errors in any components below and re-render with error message
        this.setState({ error, errorInfo }, () => {
            try {
                const stateErrorString = this.state.error?.toString();
                const currentErrorString = `SimpleErrorBoundary: ${stateErrorString}`;
                logError(new Error(currentErrorString));
            } catch (caughtError) {
                logError(
                    new Error(`SimpleErrorBoundary caughtError: ${stringFromError(caughtError)}`),
                );
            }
        });
    }

    hideError = () => this.setState({ error: null, errorInfo: null });

    render() {
        const { error, errorInfo } = this.state;
        if (errorInfo || error) {
            // Error path
            return (
                <YStack ai="center" jc="center" gap="$4">
                    <H3>Whoops!</H3>
                    <SizableText>{`Something went wrong in ${this.props.location}.`}</SizableText>
                    <SizableText>{`We've located and logged the issue, sorry for any inconvenience.`}</SizableText>
                    <XStack gap="$4">
                        <TouchableOpacity onPress={this.hideError}>
                            <H4>Close</H4>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                Updates.reloadAsync();
                            }}
                        >
                            <SizableText>Reload app</SizableText>
                        </TouchableOpacity>
                    </XStack>
                    {error?.message ? (
                        <ScrollView>
                            <SizableText>{error.message.slice(0, 100)}</SizableText>
                        </ScrollView>
                    ) : null}
                </YStack>
            );
        }
        // Normally, just render children
        return this.props.children;
    }
}
