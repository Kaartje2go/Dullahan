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
 * import 'jquery';
 * import 'jquery/file';
 *
 * @param path Any string that could be used in a require call.
 */
export const isModulePath = (path: string): path is ModulePath => {
    return !!path.length && !isRelativePath(path) && !isAbsolutePath(path);
};
