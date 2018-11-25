import { IInput } from "./input";

export function createStringInput(data: string, start?: number, end?: number) {
    if (typeof start === 'undefined') { start = 0; }
    if (typeof end === 'undefined') { end = data.length; }

    return new StringInput(data, start, end);
}

class StringInput extends IInput<number> {
    private data: string;
    private start: number;
    private end: number;
    private _next?: StringInput;

    constructor(buffer: string, start: number, end: number) {
        super();
        this.data = buffer;
        this.start = start;
        this.end = end;
    }

    public any(): boolean {
        return this.start < this.end;
    }

    public get(): number {
        if (!this.any()) { throw new Error("No more input"); }
        return this.data.charCodeAt(this.start);
    }

    public next(): StringInput {
        if (!this._next) {
            this._next = new StringInput(this.data, this.start + 1, this.end);
        }
        return this._next;
    }
}