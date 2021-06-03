import {DullahanError} from '../DullahanError';
import {DependencyPath} from "./types";

export type DullahanScopedOptions<S = string, T extends object = object> = [S | DependencyPath, Partial<T>];

export const ensureArray = <T>(input?: null | T | undefined[] | null[] | T[] | (undefined | null | T)[]): T[] => {
    const array = input ? Array.isArray(input) ? input : [input] : [];
    return array.filter<T>((entry?: T | null): entry is T => entry !== null && entry !== undefined);
};

export const ensureScopedOptions = <S = string, T extends object = object>(input?: unknown): DullahanScopedOptions<S, T> => {
    if (typeof input === 'string') {
        return [input, {}];
    }

    if (typeof input === 'function') {
        return [input as unknown as S, {}];
    }

    if (!Array.isArray(input)) {
        throw new DullahanError('Expected input to be a string/constructor or an array containing a string/constructor and an object');
    }

    const [path, options] = input;

    if (typeof path !== 'string' && typeof path !== 'function' || options && typeof options !== 'object') {
        throw new DullahanError('Expected input to be a string/constructor or an array containing a string/constructor and an object');
    }

    return [
        path,
        (options ?? {}) as T
    ];
};
