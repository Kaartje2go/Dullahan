import {AdapterError, DullahanAdapter, DullahanErrorMessage, tryX} from "@k2g/dullahan";

declare const adapter: DullahanAdapter<never, never>;

/**
 * "yarn serve-fixtures" can be used to debug this page on
 * http://localhost:5000/scroll_boxes
 */
describe('adapter.scrollToElement', () => {

    it('throws a valid error when a browser has not been opened', async () => {
        try {
            expect.hasAssertions();
            await adapter.scrollToElement('#dullahan');
        } catch (error) {
            expect(error.message).toStrictEqual(DullahanErrorMessage.NO_BROWSER);
            expect(error.name).toStrictEqual(AdapterError.NAME);
        }
    });

    it.each([
        ['#simple-overflow-x'],
        ['#simple-overflow-y'],
        ['#simple-overflow-xy'],
        ['#nested-overflow-x-x'],
        ['#nested-overflow-x-y'],
        ['#nested-overflow-x-xy'],
        ['#nested-overflow-y-x'],
        ['#nested-overflow-y-y'],
        ['#nested-overflow-y-xy'],
        ['#nested-overflow-xy-x'],
        ['#nested-overflow-xy-y'],
        ['#nested-overflow-xy-xy']
    ])('is able to scroll within "%s"; revealing the target', async (id) => {
        const target = `${id} .target`;

        await tryX(3, () => adapter.openBrowser());
        await adapter.setURL(`http://localhost:8080/scroll_boxes?show=${encodeURIComponent(id)}`, {
            timeout: 10000,
            readyState: 'interactive'
        });
        await adapter.waitForElementVisible(id, {
            timeout: 3000
        });
        await adapter.waitForElementPresent(target, {
            timeout: 3000
        });

        const before = await adapter.isElementInteractable(target);
        await adapter.scrollToElement(target);
        const after = await adapter.isElementInteractable(target);

        expect(before).toBe(false);
        expect(after).toBe(true);
    });
});
