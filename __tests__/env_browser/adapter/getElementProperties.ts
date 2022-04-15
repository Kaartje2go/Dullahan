import {AdapterError, DullahanAdapter, DullahanErrorMessage, tryX} from "@k2g/dullahan";

declare const adapter: DullahanAdapter<never, never>;

describe('adapter.getElementProperties', () => {

    it('throws a valid error when a browser has not been opened', async () => {
        try {
            expect.hasAssertions();
            await adapter.getElementProperties('#dullahan', 'dullahanProperty', 'dullahan-property');
        } catch (error: any) {
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
            await adapter.getElementProperties('#dullahan');
        } catch (error: any) {
            expect(error.message).toMatchSnapshot();
            expect(error.name).toStrictEqual(AdapterError.NAME);
        }
    });

    it('returns an empty array if no properties are specified', async () => {
        await tryX(3, () => adapter.openBrowser());
        await adapter.setURL('http://localhost:8080/clickbox', {
            timeout: 10000,
            readyState: 'interactive'
        });
        await adapter.waitForElementPresent('.clickbox', {
            timeout: 2000
        });
        const result = await adapter.getElementProperties('.clickbox');
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(0);
    });

    it('returns "null" for missing properties', async () => {
        await tryX(3, () => adapter.openBrowser());
        await adapter.setURL('http://localhost:8080/clickbox', {
            timeout: 10000,
            readyState: 'interactive'
        });
        await adapter.waitForElementPresent('.clickbox', {
            timeout: 2000
        });
        const [doesNotExist] = await adapter.getElementProperties('.clickbox', 'doesNotExist');
        expect(doesNotExist).toBe(null);
    });

    it('returns properties in order', async () => {
        await tryX(3, () => adapter.openBrowser());
        await adapter.setURL('http://localhost:8080/clickbox', {
            timeout: 10000,
            readyState: 'interactive'
        });
        await adapter.waitForElementPresent('.clickbox', {
            timeout: 2000
        });
        const [className, id] = await adapter.getElementProperties('.clickbox', 'className', 'id');
        expect(className).toContain('clickbox');
        expect(id).toBe('');
    });
});
