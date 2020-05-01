/* eslint-disable  */

import {DullahanAdapter, AdapterError, DullahanErrorMessage, tryX} from "@kaartje2go/temp-dullahan";

declare const adapter: DullahanAdapter<never, never>;

describe('adapter.openBrowser', () => {

    it('throws a valid error when a browser has already been opened', async () => {
        try {
            expect.hasAssertions();
            await tryX(3, () => adapter.openBrowser());
            await tryX(3, () => adapter.openBrowser());
        } catch (error) {
            expect(error.name).toStrictEqual(AdapterError.NAME);
            expect(error.message).toStrictEqual(DullahanErrorMessage.ACTIVE_BROWSER);
        }
    });
});
