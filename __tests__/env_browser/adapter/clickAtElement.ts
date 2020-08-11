import {AdapterError, DullahanAdapter, DullahanErrorMessage, tryX} from "@k2g/dullahan";

declare const adapter: DullahanAdapter<never, never>;

describe('adapter.clickAtElement', () => {

    it('throws a valid error when a browser has not been opened', async () => {
        try {
            expect.hasAssertions();
            await adapter.clickAtElement('#dullahan', 0, 0);
        } catch (error) {
            expect(error.message).toStrictEqual(DullahanErrorMessage.NO_BROWSER);
            expect(error.name).toStrictEqual(AdapterError.NAME);
        }
    });

    it('throws a valid error when an element cannot be found', async () => {
        try {
            expect.hasAssertions();
            await tryX(3, () => adapter.openBrowser());
            await adapter.setURL('http://localhost:8080', {
                timeout: 10000,
                readyState: 'interactive'
            });
            await adapter.clickAtElement('#dullahan', 0, 0);
        } catch (error) {
            expect(error.message).toMatchSnapshot();
            expect(error.name).toStrictEqual(AdapterError.NAME);
        }
    });

    it('calculates the offset from the top-left corner of the element', async () => {
        await tryX(3, () => adapter.openBrowser());
        await adapter.setURL('http://localhost:8080/clickbox', {
            timeout: 10000,
            readyState: 'interactive'
        });
        await adapter.displayPointer();
        await adapter.waitForElementPresent('.clickbox', {
            timeout: 2000
        });
        await adapter.waitForElementVisible('.clickbox', {
            timeout: 2000
        });
        await adapter.clickAtElement('.clickbox', 0, 0);
        const [cx1, cy1] = await adapter.getElementAttributes('svg.dullahan-cursor-history circle', 'cx', 'cy');
        expect(cx1).toBe('0');
        expect(cy1).toBe('0');

        await adapter.clickAtElement('.clickbox', 10, 10);
        const [cx2, cy2] = await adapter.getElementAttributes('svg.dullahan-cursor-history circle:nth-of-type(2)', 'cx', 'cy');
        expect(cx2).toBe('10');
        expect(cy2).toBe('10');
    });
});
