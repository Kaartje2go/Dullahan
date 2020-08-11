import {AdapterError, DullahanAdapter, DullahanErrorMessage} from "@k2g/dullahan";

declare const adapter: DullahanAdapter<never, never>;

describe('adapter.setURL', () => {

    it('throws a valid error when a browser has not been opened', async () => {
        try {
            expect.hasAssertions();
            await adapter.setURL('https://dullahan.io', {
                timeout: 0,
                readyState: 'interactive'
            });
        } catch (error) {
            expect(error.message).toStrictEqual(DullahanErrorMessage.NO_BROWSER);
            expect(error.name).toStrictEqual(AdapterError.NAME);
        }
    });
});
