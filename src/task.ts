export type Callback = () => void;
export const emptyCallback: Callback = () => { };

export class Task {
    private _combinedCallbacks = emptyCallback;
    private _finished = false;

    endWith(callback: Callback) {
        if (!callback) {
            return;
        }

        // If the task is already finished, call it
        // Else store it to delay its call on "finish()"
        this.combineCallback(callback);
        if (this._finished) {
            this._combinedCallbacks();
        }
    }

    finish() {
        this._finished = true;
        this._combinedCallbacks();
    }

    get finished() {
        return this._finished;
    }

    private combineCallback(callback: Callback) {
        const previousCombinedCallbacks = this._combinedCallbacks;
        this._combinedCallbacks = () => {
            // Trigger all callbacks
            previousCombinedCallbacks();
            callback();

            // Reset
            this._combinedCallbacks = emptyCallback;
        };
    }
}
