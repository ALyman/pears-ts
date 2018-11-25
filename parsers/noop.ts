import { IInput } from "../inputs";
import { Parser } from "./parser-base";
import { ParseResult, SuccessfulParseResult, FailedParseResult } from "../parse-result";

class SuccessfulParser<T, R> extends Parser<T, R>{
    constructor(private value: R) { super(); }

    protected tryParse(input: IInput<T>): SuccessfulParseResult<T, R> {
        return ParseResult.successful(input, input, this.value);
    }
}

class FailureParser<T, R> extends Parser<T, R>{
    constructor(private error: string | Error) { super(); }

    protected tryParse(input: IInput<T>): FailedParseResult<T> {
        return ParseResult.failure(input, this.error);
    }
}

export function noop<T>(): Parser<T, void> {
    return new SuccessfulParser<T, void>(void 0);
}

export function success<T, R>(value: R): Parser<T, R> {
    return new SuccessfulParser<T, R>(value);
}

export function fail<T, R>(error: string | Error): Parser<T, R> {
    return new FailureParser<T, R>(error);
}