/* eslint-disable  */

import {DullahanAdapter, AdapterError, DullahanErrorMessage, tryX} from "@kaartje2go/temp-dullahan";

declare const adapter: DullahanAdapter<never, never>;

describe('adapter.releaseMouseAt', () => {
    
    it('throws a valid error when a browser has not been opened', async () => {
        try {
            expect.hasAssertions();
            await adapter.releaseMouseAt(0, 0);
        } catch (error) {
            expect(error.message).toStrictEqual(DullahanErrorMessage.NO_BROWSER);
            expect(error.name).toStrictEqual(AdapterError.NAME);
        }
    });
});
