import { IInput } from "./input";

export function createBufferInput(buffer: Buffer, start?: number, end?: number) {
    if (typeof start === 'undefined') { start = 0; }
    if (typeof end === 'undefined') { end = buffer.byteLength; }

    return new BufferInput(buffer, start, end);
}

class BufferInput extends IInput<number> {
    private buffer: Buffer;
    private start: number;
    private end: number;

    constructor(buffer: Buffer, start: number, end: number) {
        super();
        this.buffer = buffer;
        this.start = start;
        this.end = end;
    }


    public any(): boolean {
        return this.start < this.end;
    }

    public get(): number {
        if (!this.any()) { throw new Error("No more input"); }
        return this.buffer[this.start];
    }

    protected createNext(): BufferInput {
        return new BufferInput(this.buffer, this.start + 1, this.end);
    }
}