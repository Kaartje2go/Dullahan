export type DullahanReadyState = 'loading' | 'interactive' | 'complete'

export type WaitForReadyStateOptions = {
    readyState: DullahanReadyState;
    timeout: number;
}

export function waitForReadyState(this: void, options: WaitForReadyStateOptions): boolean | Promise<boolean> {
    var states = {
        loading: 1,
        interactive: 2,
        complete: 3
    };
    var wantedState = states[options.readyState];
    var timeout = options.timeout;
    var interval = Math.floor(timeout / 100);
    var endTime = Date.now() + timeout;

    function performSearch(): boolean {
        try {
            return states[document.readyState] >= wantedState;
        } catch (ignored) {
            return false;
        }
    }

    if (typeof Promise !== 'undefined') {
        return new Promise(function poll(resolve, reject) {
            try {
                var result = performSearch();

                if (result) {
                     resolve(result);
                } else if (Date.now() < endTime) {
                     setTimeout(poll, interval, resolve, reject);
                } else {
                     resolve();
                }
            } catch (error) {
                reject(error);
            }
        });
    } else {
        return performSearch();
    }
}
