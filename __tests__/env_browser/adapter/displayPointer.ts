import {AdapterError, DullahanAdapter, DullahanErrorMessage, tryX} from "@k2g/dullahan";

declare const adapter: DullahanAdapter<never, never>;

describe('adapter.displayPointer', () => {

    it('throws a valid error when a browser has not been opened', async () => {
        try {
            expect.hasAssertions();
            await adapter.displayPointer();
        } catch (error) {
            expect(error.message).toStrictEqual(DullahanErrorMessage.NO_BROWSER);
            expect(error.name).toStrictEqual(AdapterError.NAME);
        }
    });

    it('renders clicks as circles', async () => {
        await tryX(3, () => adapter.openBrowser());
        await adapter.setURL('http://localhost:8080', {
            timeout: 10000,
            readyState: 'interactive'
        });
        await adapter.displayPointer();
        await adapter.clickAt(100, 200);
        await adapter.waitForElementPresent('svg.dullahan-cursor-history circle', {
            timeout: 2000
        });
        const [cx, cy] = await adapter.getElementAttributes('svg.dullahan-cursor-history circle', 'cx', 'cy');
        expect(cx).toBe('100');
        expect(cy).toBe('200');
    });

    it('renders movement as dashed lines', async () => {
        await tryX(3, () => adapter.openBrowser());
        await adapter.setURL('http://localhost:8080', {
            timeout: 10000,
            readyState: 'interactive'
        });
        await adapter.displayPointer();
        await adapter.clickAt(100, 200);
        await adapter.clickAt(300, 400);
        await adapter.waitForElementPresent('svg.dullahan-cursor-history line', {
            timeout: 2000
        });
        const [x1, y1, x2, y2, strokeDashArray] = await adapter.getElementAttributes('svg.dullahan-cursor-history line', 'x1', 'y1', 'x2', 'y2', 'stroke-dasharray');
        expect(x1).toBe('100');
        expect(y1).toBe('200');
        expect(x2).toBe('300');
        expect(y2).toBe('400');
        expect(parseFloat(strokeDashArray || '0')).toBeGreaterThan(0);
    });

    it('renders dragging as a solid line', async () => {
        await tryX(3, () => adapter.openBrowser());
        await adapter.setURL('http://localhost:8080', {
            timeout: 10000,
            readyState: 'interactive'
        });
        await adapter.displayPointer();
        await adapter.pressMouseAt(100, 200);
        await adapter.releaseMouseAt(300, 400);
        await adapter.waitForElementPresent('svg.dullahan-cursor-history line', {
            timeout: 2000
        });
        const [x1, y1, x2, y2, strokeDashArray] = await adapter.getElementAttributes('svg.dullahan-cursor-history line', 'x1', 'y1', 'x2', 'y2', 'stroke-dasharray');
        expect(x1).toBe('100');
        expect(y1).toBe('200');
        expect(x2).toBe('300');
        expect(y2).toBe('400');
        expect(parseFloat(strokeDashArray || '0')).toBe(0);
    });

    it.skip('covers the entire page', async () => {
        // Don't know how to test, yet
    });

    it('filters duplicate clicks', async () => {
        await tryX(3, () => adapter.openBrowser());
        await adapter.setURL('http://localhost:8080', {
            timeout: 10000,
            readyState: 'interactive'
        });
        await adapter.displayPointer();
        await adapter.clickAt(100, 100);
        await adapter.clickAt(100, 100);
        await adapter.waitForElementPresent('svg.dullahan-cursor-history circle:nth-of-type(1)', {
            timeout: 2000
        });
        const isPresent = await adapter.isElementPresent('svg.dullahan-cursor-history circle:nth-of-type(2)');
        expect(isPresent).toBe(false);
    });
});
