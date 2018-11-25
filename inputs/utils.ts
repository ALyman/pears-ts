import { IInput } from "./input";

export function* iterateValues<T>(input: IInput<T>) {
    while (input.any()) {
        yield input.get();
        input = input.next();
    }
}

export function* iterateInputs<T>(input: IInput<T>) {
    while (input.any()) {
        yield input;
        input = input.next();
    }
    yield input;
}