import {DullahanApi, DullahanTest} from '@kaartje2go/temp-dullahan';

export default new DullahanTest({
    name: 'A user should be able to do something',
    tags: ['something'],
    disabled: false,

    run: async (api: DullahanApi): Promise<void> => {
        await api.goto('https://dullahan.io');
        await api.assert('the title is slick', async (expect) => {
            const title = await api.getText('.projectTitle');
            expect(title).toStrictEqual('Dullahan\nRun acceptance tests anywhere at lightning speed');
        });
        await api.waitForNavigation(() => api.click('a[href="/docs/"]'));
        await api.pressMouse('article', -50, -50);
        await api.releaseMouse('article', +50, -50);
        await api.pressMouse('article', +50, +50);
        await api.releaseMouse('article', -50, +50);
        await api.click('article');
    }
});
