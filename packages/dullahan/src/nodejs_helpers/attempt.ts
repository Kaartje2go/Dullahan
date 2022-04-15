export const tryX = async <T = void>(maximumTries: number, callback: () => Promise<T>): Promise<T> => {
    let e;

    for (let i = 1; i <= maximumTries; i++) {
        try {
            const result = await callback();

            return result;
        } catch (error: any) {
            e = error;
        }
    }

    throw e;
};

export const tryIgnore = async (maximumTries: number, callback: () => Promise<unknown>): Promise<void> => {
    try {
        await tryX(maximumTries, callback);
    } catch {
        // Ignore
    }
};
