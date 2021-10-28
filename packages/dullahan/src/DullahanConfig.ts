import {
    AdapterConstructor,
    ApiContructor, DependencyPath,
    hasProperty,
    PluginConstructor,
    RunnerConstructor
} from './nodejs_helpers/types';

export type DullahanConfig = {
    api: [DependencyPath | ApiContructor, object];
    adapter: [DependencyPath | AdapterConstructor, object];
    runner: [DependencyPath | RunnerConstructor, object];
    plugins: [DependencyPath | PluginConstructor, object][];
}

export const isDullahanConfig = (input: unknown): input is DullahanConfig => {
    // It's not perfect, but it at least verifies the shape of the input
    return hasProperty(input, 'api') && hasProperty(input, 'adapter')
        && hasProperty(input, 'runner') && hasProperty(input, 'plugins');
};
