import { IInput } from "../inputs";
import { Parser } from "../parsers/parser-base";
import { ParseResult, SuccessfulParseResult, FailedParseResult } from "../parse-result";

class MockParser<T, R> extends Parser<T, R>{
    constructor(protected tryParse: (input: IInput<T>) => ParseResult<T, R>) {
        super();
    }
}

export function mockSuccess<T>(value: T): MockParser<T, T> {
    return new MockParser((input): SuccessfulParseResult<T, T> => {
        return ParseResult.successful(input, input.next(), value);
    });
}

export function mockFailure<T>(error: string | Error): MockParser<T, T> {
    return new MockParser((input): FailedParseResult<T> => {
        return ParseResult.failure(input, error);
    });
}
