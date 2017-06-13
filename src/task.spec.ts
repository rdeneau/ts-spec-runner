import { Callback, emptyCallback, Task } from './task';

class EmptyCallbackVerifiable {
    private _count = 0;
    private _fn: Callback = () => {
        this._count++;
    };

    get count() { return this._count; }
    get fn() { return this._fn; }
}

describe('Task', () => {
    describe('constructor() should', () => {
        it('create task not yet finished', () => {
            const task = new Task();
            expect(task.finished).toBeFalsy();
            console.log('hello2');
        });
    });

    describe('endWith() should', () => {
        it('not trigger registred callbacks when not finished', () => {
            const task = new Task();
            const callback1 = new EmptyCallbackVerifiable()
            const callback2 = new EmptyCallbackVerifiable()

            task.endWith(callback1.fn);
            task.endWith(callback2.fn);

            expect(callback1.count).toEqual(0);
            expect(callback2.count).toEqual(0);
        });

        it('trigger callbacks when already finished', () => {
            const task = new Task();
            const callback1 = new EmptyCallbackVerifiable()
            const callback2 = new EmptyCallbackVerifiable()

            task.finish();

            task.endWith(callback1.fn);
            task.endWith(callback2.fn);

            expect(callback1.count).toEqual(1);
            expect(callback2.count).toEqual(1);
        });
    });

    describe('finish() should', () => {
        it('mark the task as finished when called 1, 2, 3 times', () => {
            const task = new Task();
            const timeCount = 3;
            for (let i = 0; i < timeCount; i++) {
                task.finish();
                expect(task.finished).toBeTruthy();
            }
        });

        it('trigger all registred callbacks only on finish()', () => {
            const task = new Task();
            const callback1 = new EmptyCallbackVerifiable()
            const callback2 = new EmptyCallbackVerifiable()

            task.endWith(callback1.fn);
            task.endWith(callback2.fn);

            expect(callback1.count).toEqual(0);
            expect(callback2.count).toEqual(0);

            task.finish();

            expect(callback1.count).toEqual(1);
            expect(callback2.count).toEqual(1);
        });

        it('reset callbacks', () => {
            const task = new Task();
            const callback1 = new EmptyCallbackVerifiable()
            const callback2 = new EmptyCallbackVerifiable()

            task.endWith(callback1.fn);
            task.finish();
            task.endWith(callback2.fn);
            task.finish();

            expect(callback1.count).toEqual(1); // Still 1, not 2
            expect(callback2.count).toEqual(1); // Still 1, not 2
        });
    });
});
