import {DullahanAdapter, AdapterError, DullahanErrorMessage, tryX} from "@k2g/dullahan";

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
