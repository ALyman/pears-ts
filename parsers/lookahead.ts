import { IInput } from "../inputs";
import { Parser, IParseContext } from "./parser-base";
import { ParseResult, SuccessfulParseResult, isSuccessful } from "../parse-result";

class LookaheadParser<T, R> extends Parser<T, R> {
    constructor(private parser: Parser<T, R>) { super(); }

    protected tryParse(input: IInput<T>, context: IParseContext): ParseResult<T, R> {
        let result = this.parser.parse(input, context);
        if (isSuccessful(result)) {
            return Object.assign(result.clone(), { end: input } as Partial<SuccessfulParseResult<T, R>>);
        } else {
            return result;
        }
    }
}

export function lookahead<T, R>(parser: Parser<T, R>): Parser<T, R> {
    return new LookaheadParser<T, R>(parser);
}