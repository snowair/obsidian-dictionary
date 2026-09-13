/**
 * Default timeout (in milliseconds) applied to every remote API request.
 * A request that takes longer than this is rejected so the UI does not hang.
 */
export const REQUEST_TIMEOUT = 1000;

/**
 * Wraps a Promise so it rejects if it does not settle within `timeout` milliseconds.
 *
 * Obsidian's `request` / `requestUrl` helpers (and `fetch`) do not expose a timeout
 * option, so we race the request against a timer and reject with a descriptive
 * error when the deadline is exceeded.
 *
 * @param promise - The promise (usually a network request) to guard
 * @param timeout - Time in milliseconds before the request is considered timed out
 *                  (defaults to {@link REQUEST_TIMEOUT})
 * @returns The result of `promise`, or a rejected Promise if it takes too long
 */
export function withTimeout<T>(
    promise: Promise<T>,
    timeout: number = REQUEST_TIMEOUT
): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const timer = window.setTimeout(() => {
            reject(new Error(`Request timed out after ${timeout}ms`));
        }, timeout);

        promise.then(
            (result) => {
                window.clearTimeout(timer);
                resolve(result);
            },
            (error) => {
                window.clearTimeout(timer);
                reject(error);
            }
        );
    });
}
