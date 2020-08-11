import {AdapterError} from '@k2g/dullahan';

describe('AdapterError', () => {

    it('should have the correct name', () => {
        const error = new AdapterError('message');
        expect(error.name).toStrictEqual(AdapterError.NAME);
    });

    it('should have the correct message', () => {
        const error = new AdapterError('message');
        expect(error.message).toStrictEqual('message');
    });

    it('should serialize correctly', () => {
        const error = new AdapterError('message');
        const stringified = JSON.stringify(error);
        const parsed = JSON.parse(stringified);
        expect(parsed.name).toStrictEqual(AdapterError.NAME);
        expect(parsed.message).toStrictEqual('message');
    });
});
