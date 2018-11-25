import { IInput } from "../inputs";
import { Parser } from "./parser-base";
import { ParseResult } from "../parse-result";

class EqualParser<T> extends Parser<T, T> {
    constructor(private expected: T) { super() }

    tryParse(at : IInput<T>) : ParseResult<T,T> {
        if (!at.any()) {
            return ParseResult.failure(at, `unexpected end of file, expected '${this.expected}'`);
        }
        let value = at.get();
        if (value === this.expected) {
            return ParseResult.successful(at, at.next(), value);
        }
        return ParseResult.failure(at, `unexpected '${value}', expected '${this.expected}'`);
    }
}

export function equal<T>(expected: T): Parser<T, T> {
    return new EqualParser(expected);
}
