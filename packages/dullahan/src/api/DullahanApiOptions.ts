export type DullahanApiUserOptions = Partial<{
    autoScroll: true;
    displayPointer: boolean;
    defaultTimeout: number;
    defaultNetworkTimeout: number;
}>;

export const DullahanApiDefaultOptions = {
    autoScroll: true,
    displayPointer: true,
    defaultTimeout: 15000,
    defaultNetworkTimeout: 30000
};

export type DullahanApiOptions = DullahanApiUserOptions & typeof DullahanApiDefaultOptions;
