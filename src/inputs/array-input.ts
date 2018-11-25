import { IInput } from "./input";

export function createArrayInput<T>(buffer: ReadonlyArray<T>, start?: number, end?: number) {
    if (typeof start === 'undefined') { start = 0; }
    if (typeof end === 'undefined') { end = buffer.length; }

    return new ArrayInput(buffer, start, end);
}

class ArrayInput<T = {}> extends IInput<T> {
    private data: ReadonlyArray<T>;
    private start: number;
    private end: number;
    private _next?: ArrayInput<T>;

    constructor(buffer: ReadonlyArray<T>, start: number, end: number) {
        super();
        this.data = buffer;
        this.start = start;
        this.end = end;
    }

    public any(): boolean {
        return this.start < this.end;
    }

    public get(): T {
        if (!this.any()) { throw new Error("No more input"); }
        return this.data[this.start];
    }

    public next(): ArrayInput<T> {
        if (!this._next) {
            this._next = new ArrayInput(this.data, this.start + 1, this.end);
        }
        return this._next;
    }
}