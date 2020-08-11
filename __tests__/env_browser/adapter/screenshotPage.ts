import {AdapterError, DullahanAdapter, DullahanErrorMessage, tryX} from "@k2g/dullahan";

declare const adapter: DullahanAdapter<never, never>;

describe('adapter.screenshotPage', () => {

    it('throws a valid error when a browser has not been opened', async () => {
        try {
            expect.hasAssertions();
            await adapter.screenshotPage();
        } catch (error) {
            expect(error.message).toStrictEqual(DullahanErrorMessage.NO_BROWSER);
            expect(error.name).toStrictEqual(AdapterError.NAME);
        }
    });

    it('returns only base64; not a data URI', async () => {
        await tryX(3, () => adapter.openBrowser());
        await adapter.setURL('http://localhost:8080', {
            timeout: 10000,
            readyState: 'interactive'
        });
        const screenshot = await adapter.screenshotPage();
        expect(screenshot).not.toMatch(/^data:image\/png;base64,/i);
        expect(screenshot).toMatch(/[a-z0-9\+\/=]+$/i);
    });
});
