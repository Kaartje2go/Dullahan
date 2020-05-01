import {FindElementOptions} from './browser_helpers/findElement';

export class DullahanError extends Error {

    public static readonly NAME: string = 'DullahanError';

    public readonly name: string = DullahanError.NAME;

    public constructor(error: Error)

    public constructor(message: string)

    public constructor(messageOrError: string | Error) {
        super(typeof messageOrError === 'string' ? messageOrError : messageOrError.message);

        if (typeof messageOrError !== 'string' && messageOrError.stack) {
            this.stack = messageOrError.stack;
        }
    }

    /**
     * Allows `JSON.stringify` to properly serialize this error object.
     *
     * @example
     * ```ts
     * const nativeError = new Error('Help!');
     * JSON.stringify(nativeError);
     * // -> '{}'
     *
     * const dullahanError = new DullahanError('Help!');
     * JSON.stringify(dullahanError);
     * // -> '{"name":"DullahanError","message":"Help!","stack":"very long"}'
     * ```
     */
    public toJSON(): {
        name: string;
        message: string;
        stack: string;
        } {
        const {name, message, stack = ''} = this;

        return {name,
            message,
            stack};
    }
}

export class AdapterError extends DullahanError {
    public static readonly NAME: string = 'AdapterError';

    public readonly name: string = AdapterError.NAME;
}

export class AssertionError extends DullahanError {
    public static readonly NAME: string = 'AssertionError';

    public readonly name: string = AssertionError.NAME;
}

export const DullahanErrorMessage = {
    NO_BROWSER: 'Browser has been closed, or has not yet been opened!',
    ACTIVE_BROWSER: 'Browser has already been opened!',
    findElementResult: ({selector, visibleOnly, onScreenOnly, expectNoMatches, timeout}: FindElementOptions) => {
        let message = 'Found';
        message += expectNoMatches ? ' an element ' : ' no element';
        message += ` for selector "${selector}"`;

        if (visibleOnly && onScreenOnly) {
            message += ' with filter [visible=true, onscreen=true]';
        } else if (visibleOnly) {
            message += ' with filter [visible=true]';
        } else if (onScreenOnly) {
            message += ' with filter [onscreen=true]';
        }

        if (timeout) {
            message += ` after ${timeout}ms`;
        }

        return message;
    }
} as const;


