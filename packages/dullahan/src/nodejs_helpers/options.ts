import {DullahanError} from '../DullahanError';

export type DullahanScopedOptions<T extends object = object> = [string, Partial<T>];

export const ensureArray = <T>(input?: null | T | undefined[] | null[] | T[] | (undefined | null | T)[]): T[] => {
    const array = input ? Array.isArray(input) ? input : [input] : [];
    return array.filter<T>((entry?: T | null): entry is T => entry !== null && entry !== undefined);
};

export const ensureScopedOptions = <T extends object>(input?: unknown): DullahanScopedOptions<T> => {
    if (typeof input === 'string') {
        return [input, {}];
    }

    if (!Array.isArray(input)) {
        throw new DullahanError('Expected input to be a string or an array containing a string and an object');
    }

    const [path, options] = input;

    if (typeof path !== 'string' || options && typeof options !== 'object') {
        throw new DullahanError('Expected input to be a string or an array containing a string and an object');
    }

    return [
        path,
        (options ?? {}) as T
    ];
};
