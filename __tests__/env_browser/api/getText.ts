/* eslint-disable  */

import {DullahanApi, AdapterError, DullahanErrorMessage, DullahanAdapter} from "@k2g/dullahan";

declare const api: DullahanApi<never, never>;
declare const adapter: DullahanAdapter<never, never>;

describe('api.getText', () => {

    it('throws a valid error when a browser has not been opened', async () => {
        try {
            expect.hasAssertions();
            await api.getText('#dullahan');
        } catch (error) {
            expect(error.message).toStrictEqual(DullahanErrorMessage.NO_BROWSER);
            expect(error.name).toStrictEqual(AdapterError.NAME);
        }
    });
});
