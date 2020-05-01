/* eslint-disable  */

import {DullahanApi, DullahanAdapter} from "@kaartje2go/temp-dullahan";

declare const api: DullahanApi<never, never>;
declare const adapter: DullahanAdapter<never, never>;

describe('api.constructor', () => {

    it('does not do anything yet', () => {
        expect(true).toBe(true);
        expect('foo').toMatchSnapshot();
    })
});
