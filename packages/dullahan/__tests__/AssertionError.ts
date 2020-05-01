/* eslint-disable */

import {AssertionError} from '@kaartje2go/temp-dullahan';

describe('AdapterError', () => {
    
    it('should have the correct name', () => {
        const error = new AssertionError('message');
        expect(error.name).toStrictEqual(AssertionError.NAME);
    });

    it('should have the correct message', () => {
        const error = new AssertionError('message');
        expect(error.message).toStrictEqual('message');
    });

    it('should stringify correctly', () => {
        const error = new AssertionError('message');
        const stringified = JSON.stringify(error);
        const parsed = JSON.parse(stringified);
        expect(parsed.name).toStrictEqual(AssertionError.NAME);
        expect(parsed.message).toStrictEqual('message');
    });
});
