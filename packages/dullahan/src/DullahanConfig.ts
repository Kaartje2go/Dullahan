export type DullahanConfig = {
    api: [string, object];
    adapter: [string, object];
    runner: [string, object];
    plugins: [string, object][];
}

export const isDullahanConfig = (input: any): input is DullahanConfig => true;
