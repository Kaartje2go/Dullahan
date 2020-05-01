/* eslint-disable  */

import {AdapterError, DullahanAdapter, DullahanErrorMessage, tryX} from "@kaartje2go/temp-dullahan";

declare const adapter: DullahanAdapter<never, never>;

describe('adapter.getUrl', () => {

    it('throws a valid error when a browser has not been opened', async () => {
        try {
            expect.hasAssertions();
            await adapter.getURL();
        } catch (error) {
            expect(error.message).toStrictEqual(DullahanErrorMessage.NO_BROWSER);
            expect(error.name).toStrictEqual(AdapterError.NAME);
        }
    });

    it('handles the browser\'s start page without errors', async () => {
        await tryX(3, () => adapter.openBrowser());
        const url = await adapter.getURL();
        expect(typeof url).toBe('string');
    });

    it('can be used immediately after navigating', async () => {
        await tryX(3, () => adapter.openBrowser());
        await adapter.setURL('http://localhost:8080', {
            readyState: 'interactive',
            timeout: 10000
        });
        const url = await adapter.getURL();
        expect(url).toBe('http://localhost:8080/');
    });
});
