export type DullahanAdapterUserOptions = Partial<{
    headless: boolean;
    browserName: string;
    browserVersion: string;
    debug: boolean;
 }>;

export const DullahanAdapterDefaultOptions = {
    headless: false,
    debug: true
};

export type DullahanAdapterOptions = DullahanAdapterUserOptions & typeof DullahanAdapterDefaultOptions;
