import { IInput } from "../inputs";
import { Parser, IParseContext } from "./parser-base";
import { ParseResult, isSuccessful } from "../parse-result";

class MapParser<T, R1, R2> extends Parser<T, R2> {
    constructor(private parser: Parser<T, R1>, private fn: (value: R1) => R2) { super(); }

    protected tryParse(input: IInput<T>, context: IParseContext): ParseResult<T, R2> {
        let result = this.parser.parse(input, context);
        if (isSuccessful(result)) {
            try {
                return ParseResult.successful(result.start, result.end, this.fn(result.value));
            } catch (ex) {
                return ParseResult.failure(input, ex);
            }
        } else {
            return result;
        }
    }
}

export function map<T, R1, R2>(parser: Parser<T, R1>, fn: (value: R1) => R2): Parser<T, R2> {
    return new MapParser<T, R1, R2>(parser, fn);
}