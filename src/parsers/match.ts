import { IInput } from "../inputs";
import { Parser } from "./parser-base";
import { ParseResult } from "../parse-result";

class MatchParser<T> extends Parser<T, T> {
    constructor(private predicate: (value: T) => boolean) { super() }

    tryParse(at: IInput<T>): ParseResult<T, T> {
        if (!at.any()) {
            return ParseResult.failure(at, `unexpected end of file, expected ${this.predicate.name}`);
        }
        let value = at.get();
        if (this.predicate(at.get())) {
            return ParseResult.successful(at, at.next(), value);
        }
        return ParseResult.failure(at, `unexpected '${value}', expected ${this.predicate.name}`);
    }
}

export function match<T>(predicate: (value: T) => boolean): Parser<T, T> {
    return new MatchParser(predicate);
}
