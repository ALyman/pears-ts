import { IInput } from "../inputs";
import { Parser } from "../parsers/parser-base";
import { ParseResult, SuccessfulParseResult, FailedParseResult } from "../parse-result";

class MockParser<T, R> extends Parser<T, R>{
    constructor(protected tryParse: (input: IInput<T>) => ParseResult<T, R>) {
        super();
    }
}

export function mockParser<T, R>(map : Map<IInput<T>, ParseResult<T, R>>): MockParser<T,R> {
    return new MockParser((input): ParseResult<T, R> => {
        let result = map.get(input);
        if (!result) {
            result = ParseResult.failure(input, new Error(`Unexpected input for MockParser`));
        }
        return result;
    });
}

export function successParser<T>(value: T): MockParser<T, T> {
    return new MockParser((input): SuccessfulParseResult<T, T> => {
        return ParseResult.successful(input, input.next(), value);
    });
}

export function failureParser<T>(error: string | Error): MockParser<T, T> {
    return new MockParser((input): FailedParseResult<T> => {
        return ParseResult.failure(input, error);
    });
}

export function neverParser<T = any, R = any>(): MockParser<T, R> {
    return new MockParser((): ParseResult<T,R> => {
        throw new Error("This parser should never be called")
    });
}
