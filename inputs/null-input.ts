import { IInput } from "./input";

export function createNullInput<T>(): IInput<T> {
    return new NullInput<T>();
}

class NullInput<T = {}> extends IInput<T> {
    public any(): boolean {
        return false;
    }

    public get(): T {
        throw new Error("No more input");
    }

    protected createNext(): IInput<T> {
        return this;
    }
}