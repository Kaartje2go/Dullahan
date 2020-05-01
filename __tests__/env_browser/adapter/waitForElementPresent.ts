/* eslint-disable  */

import {AdapterError, DullahanAdapter, DullahanErrorMessage, tryX} from "@k2g/dullahan";

declare const adapter: DullahanAdapter<never, never>;

describe('adapter.waitForElementPresent', () => {

    it('throws a valid error when a browser has not been opened', async () => {
        try {
            expect.hasAssertions();
            await adapter.waitForElementPresent('#dullahan', {
                timeout: 0
            });
        } catch (error) {
            expect(error.message).toStrictEqual(DullahanErrorMessage.NO_BROWSER);
            expect(error.name).toStrictEqual(AdapterError.NAME);
        }
    });

    it('throws a valid error when the timeout has been reached', async () => {
        await tryX(3, () => adapter.openBrowser());
        await adapter.setURL('http://localhost:8080', {
            timeout: 10000,
            readyState: 'interactive'
        });
        try {
            expect.hasAssertions();
            await adapter.waitForElementPresent('#dullahan', {
                timeout: 0
            });
        } catch (error) {
            expect(error.message).toMatchSnapshot();
            expect(error.name).toStrictEqual(AdapterError.NAME);
        }
    });
});
