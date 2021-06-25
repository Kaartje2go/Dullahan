export type DullahanAdapterUserOptions = Partial<{
    slowMotion: number;
    headless: boolean;
    browserName: string;
    browserVersion: string;
    debug: boolean;
 }>;

export const DullahanAdapterDefaultOptions = {
    slowMotion: 0,
    headless: false,
    debug: true
};

export type DullahanAdapterOptions = DullahanAdapterUserOptions & typeof DullahanAdapterDefaultOptions;

export type GenericKey = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown';
