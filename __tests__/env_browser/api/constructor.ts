/* eslint-disable  */

import {DullahanApi, DullahanAdapter} from "@k2g/dullahan";

declare const api: DullahanApi<never, never>;
declare const adapter: DullahanAdapter<never, never>;

describe('api.constructor', () => {

    it('does not do anything yet', () => {
        expect(true).toBe(true);
        expect('foo').toMatchSnapshot();
    })
});
