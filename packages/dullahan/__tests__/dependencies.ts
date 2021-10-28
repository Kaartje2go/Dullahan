import {isAbsolutePath, isRelativePath, isModulePath} from '@k2g/dullahan';

describe('isAbsolutePath', () => {

    it('should identify unix-style absolute paths', () => {
        expect(isAbsolutePath('/home/me/file.js')).toBe(true);
    });

    it('should identify windows-style absolute paths', () => {
        expect(isAbsolutePath('C:\\Users\\Me\\file.js')).toBe(true);
    });

    it('should not yield false-positives for invalid, relative or module paths', () => {
        expect(isAbsolutePath('')).toBe(false);
        expect(isAbsolutePath('./file.js')).toBe(false);
        expect(isAbsolutePath('../file.js')).toBe(false);
        expect(isAbsolutePath('.\\file.js')).toBe(false);
        expect(isAbsolutePath('..\\file.js')).toBe(false);
        expect(isAbsolutePath('@k2g/dullahan')).toBe(false);
        expect(isAbsolutePath('dullahan')).toBe(false);
    });
});

describe('isRelativePath', () => {

    it('should identify unix-style relative paths', () => {
        expect(isRelativePath('./file.js')).toBe(true);
        expect(isRelativePath('../file.js')).toBe(true);
    });

    it('should identify windows-style relative paths', () => {
        expect(isRelativePath('.\\file.js')).toBe(true);
        expect(isRelativePath('..\\file.js')).toBe(true);
    });

    it('should not yield false-positives for invalid, absolute or module paths', () => {
        expect(isRelativePath('')).toBe(false);
        expect(isRelativePath('/home/me/file.js')).toBe(false);
        expect(isRelativePath('C:\\Users\\Me\\file.js')).toBe(false);
        expect(isRelativePath('@k2g/dullahan')).toBe(false);
        expect(isRelativePath('dullahan')).toBe(false);
    });
});

describe('isModulePath', () => {

    it('should identify module paths', () => {
        expect(isModulePath('@k2g/dullahan')).toBe(true);
        expect(isModulePath('dullahan')).toBe(true);
    });

    it('should not yield false-positives for invalid, absolute or module paths', () => {
        expect(isModulePath('')).toBe(false);
        expect(isModulePath('/home/me/file.js')).toBe(false);
        expect(isModulePath('C:\\Users\\Me\\file.js')).toBe(false);
        expect(isModulePath('./file.js')).toBe(false);
        expect(isModulePath('../file.js')).toBe(false);
        expect(isModulePath('.\\file.js')).toBe(false);
        expect(isModulePath('..\\file.js')).toBe(false);
    });
});
