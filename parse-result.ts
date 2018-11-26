import { IInput } from "./inputs";

export function isSuccessful<T, R>(r: PartialParseResult<T, R>): r is SuccessfulParseResult<T, R> {
    return r instanceof SuccessfulParseResult;
}

export function isFailure<T, R>(r: PartialParseResult<T, R>): r is FailedParseResult<T> {
    return r instanceof FailedParseResult;
}

export class SuccessfulParseResult<T, R> {
    public readonly start: IInput<T>;
    public readonly end: IInput<T>;
    public readonly value: R;

    constructor(start: IInput<T>, end: IInput<T>, value: R) {
        this.start = start;
        this.end = end;
        this.value = value;
    }

    clone(): SuccessfulParseResult<T, R> {
        return new SuccessfulParseResult(this.start, this.end, this.value);
    }
}

export class FailedParseResult<T> {
    public readonly errors: Array<Error | string>;
    public readonly start: IInput<T>;

    constructor(start: IInput<T>, errors: Array<string | Error>) {
        this.start = start;
        this.errors = errors;
    }
}

export class InitialParseResult<T> {
    public readonly start: IInput<T>;
    public readonly end: IInput<T>;

    constructor(start: IInput<T>) {
        this.start = start;
        this.end = start;
    }
}

export type ParseResult<T, R> = SuccessfulParseResult<T, R> | FailedParseResult<T>;

export type PartialParseResult<T, R> = ParseResult<T, R> | InitialParseResult<T>;

export namespace ParseResult {
    export function successful<T, R>(start: IInput<T>, end: IInput<T>, value: R): SuccessfulParseResult<T, R> {
        return new SuccessfulParseResult(start, end, value);
    }

    export function failure<T>(start: IInput<T>, ...errors: Array<string | Error>): FailedParseResult<T> {
        return new FailedParseResult(start, errors);
    }

    export function initial<T>(start: IInput<T>): InitialParseResult<T> {
        return new InitialParseResult(start);
    }
}