import {DullahanTest} from "../DullahanTest";
import {DullahanAdapter, DullahanAdapterArguments} from "../adapter/DullahanAdapter";
import {DullahanApi, DullahanApiArguments} from "../api/DullahanApi";
import {DullahanClient} from "../DullahanClient";
import {DullahanPlugin} from "../DullahanPlugin";
import {DullahanRunner, DullahanRunnerArguments} from "../runner/DullahanRunner";

export type AbsolutePath = string;
export type RelativePath = string;
export type ModulePath = string;
export type DependencyPath = AbsolutePath | RelativePath | ModulePath;

/**
 * Checks the path to be an absolute path.
 * Does not check for the existence of a file extension.
 * Does not check if the file or directory actually exists.
 *
 * @example
 * import '/home/me/file.js';
 * import 'C:\Users\Me\file.js';
 *
 * @param path Any string that could be used in a require call.
 */
export const isAbsolutePath = (path: string): path is AbsolutePath => {
  return /^(\/|[a-z]:)/i.test(path);
};

/**
 * Checks the path to be a relative path.
 * Does not check for the existence of a file extension.
 * Does not check if the file or directory actually exists.
 *
 * @example
 * import './file';
 * import '../file';
 *
 * @param path Any string that could be used in a require call.
 */
export const isRelativePath = (path: string): path is RelativePath => {
    return path.startsWith('.');
};

/**
 * Checks the path to be a module path.
 * Does not check for the existence of a file extension.
 * Does not check if the file or directory actually exists.
 *
 * @example
 * import '@k2g/dullahan';
 * import '@k2g/dullahan/file';
 *
 * @param path Any string that could be used in a require call.
 */
export const isModulePath = (path: string): path is ModulePath => {
    return !!path.length && !isRelativePath(path) && !isAbsolutePath(path);
};

export type ApiContructor = new (args: DullahanApiArguments<any, any>) => DullahanApi<any, any>;

export type AdapterConstructor = new (args: DullahanAdapterArguments<any, any>) => DullahanAdapter<any, any>;

export type RunnerConstructor = new (args: DullahanRunnerArguments<any, any>) => DullahanRunner<any, any>;

export type PluginConstructor = new (args: {
    client: DullahanClient;
    userOptions: object;
}) => DullahanPlugin<any, any>;

export const hasProperty = <O, P extends PropertyKey>(object: O, property: P): object is O & Record<P, unknown> => {
    return object !== null && typeof object === 'object' && Object.prototype.hasOwnProperty.call(object, property);
};
