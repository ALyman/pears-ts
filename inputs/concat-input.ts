import { IInput } from "./input";
import { createNullInput } from "./null-input";

export function createConcatInput<T>(...inputs: IInput<T>[]): IInput<T> {
    switch (inputs.length) {
        case 0: return createNullInput<T>();
        case 1: return inputs[0];
        default:
            return new ConcatInput(inputs);
    }
}

class ConcatInput<T = {}> extends IInput<T> {
    inputs: ReadonlyArray<IInput<T>>
    constructor(inputs: ReadonlyArray<IInput<T>>) {
        super();

        this.inputs = inputs.filter(i => i.any());
    }

    public any(): boolean {
        return this.inputs.length > 0 && this.inputs[0].any();
    }

    public get(): T {
        if (this.inputs.length > 0) {
            return this.inputs[0].get();
        }

        throw new Error("No more input");
    }

    protected createNext(): IInput<T> {
        return createConcatInput(this.inputs[0].next(), ...this.inputs.slice(1));
    }
}