import {DullahanAdapter, tryX} from "@k2g/dullahan";

declare const adapter: DullahanAdapter<never, never>;

describe('adapter.getUrl', () => {

    it('returns "false" if a browser has not been opened', async () => {
        const open = await adapter.isBrowserOpen();
        expect(open).toBe(false);
    });

    it('returns "true" if a browser has been opened', async () => {
        await tryX(3, () => adapter.openBrowser());
        const open = await adapter.isBrowserOpen();
        expect(open).toBe(true);
    });

    it('returns "false" if a browser has been closed', async () => {
        await tryX(3, () => adapter.openBrowser());
        await adapter.closeBrowser();
        const open = await adapter.isBrowserOpen();
        expect(open).toBe(false);
    });
});
