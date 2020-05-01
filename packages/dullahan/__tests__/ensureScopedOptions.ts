/* eslint-disable jest/prefer-expect-assertions */
import {ensureScopedOptions} from '@k2g/dullahan';

describe('ensureScopedOptions', () => {

    it('should accept a single string value', () => {
        expect(ensureScopedOptions('string')).toStrictEqual(['string', {}]);
    });

    it('should accept an array consisting of a string value', () => {
        expect(ensureScopedOptions(['string'])).toStrictEqual(['string', {}]);
    });

    it('should accept an array consisting of a string value and an object', () => {
        expect(ensureScopedOptions(['string', {}])).toStrictEqual(['string', {}]);
    });

    it('should throw an error if the argument is not a type we can work with', () => {
        const message = 'Expected input to be a string or an array containing a string and an object';

        expect(ensureScopedOptions.bind(null, undefined)).toThrow(message);
        expect(ensureScopedOptions.bind(null, null as unknown as undefined)).toThrow(message);
        expect(ensureScopedOptions.bind(null, {} as unknown as undefined)).toThrow(message);

        expect(ensureScopedOptions.bind(null, [undefined, undefined])).toThrow(message);
        expect(ensureScopedOptions.bind(null, [undefined, {}])).toThrow(message);
        expect(ensureScopedOptions.bind(null, [undefined, (): object => ({})])).toThrow(message);
        expect(ensureScopedOptions.bind(null, ['string', (): object => ({})])).toThrow(message);
    });
});
