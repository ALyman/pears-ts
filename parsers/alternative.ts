import { IInput } from "../inputs";
import { Parser, IParseContext } from "./parser-base";
import { PartialParseResult, ParseResult, isSuccessful } from "../parse-result";

class AlternativeParser<T, R> extends Parser<T, R> {
    constructor(private parsers: Parser<T, R>[]) { super(); }

    protected tryParse(input: IInput<T>, context: IParseContext): ParseResult<T, R> {
        let results = this.parsers.reduce<PartialParseResult<T, R>[]>((results, subparser) => {
            var last = results[results.length - 1];
            if (isSuccessful(last)) {
                return results;
            } else {
                return [...results, subparser.parse(input, context)];
            }
        }, [ParseResult.initial(input)]);
        results.splice(0, 1);
        var last = results[results.length - 1];
        return last as ParseResult<T, R>;
    }
}

export function alternative<T, R>(...parsers: Parser<T, R>[]): Parser<T, R> {
    if (parsers.length === 0) {
        throw new Error("Can not create a alternative with no elements");
    }

    return new AlternativeParser(parsers);
}