export type DullahanApiUserOptions = Partial<{
    slowMotion: number;
    autoScroll: true;
    displayPointer: boolean;
    defaultTimeout: number;
    defaultNetworkTimeout: number;
}>;

export const DullahanApiDefaultOptions = {
    slowMotion: 0,
    autoScroll: true,
    displayPointer: true,
    defaultTimeout: 30000,
    defaultNetworkTimeout: 30000
};

export type DullahanApiOptions = DullahanApiUserOptions & typeof DullahanApiDefaultOptions;
