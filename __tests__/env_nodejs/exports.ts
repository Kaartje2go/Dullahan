/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable jest/prefer-inline-snapshots */
/* eslint-disable jest/valid-title */
import {sync as globSync} from 'glob';

globSync('packages/*/').forEach((path: string) => {
    const packageName = `@kaartje2go/temp-${/\/(dullahan[a-z0-9-]*)\//u.exec(path)![1]}`;
    const packageExports = require(packageName) ?? ({
        empty: null
    });
    const packageEntries = Object.entries(packageExports);

    describe(packageName, () => {
        it.each(packageEntries)('%s should remain the same', (key, value) => {
            expect(value).toMatchSnapshot();
        });
    });
});
