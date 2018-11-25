import { IInput } from "../inputs";
import { Parser, IParseContext } from "./parser-base";
import { PartialParseResult, ParseResult, SuccessfulParseResult, FailedParseResult, isFailure, isSuccessful } from "../parse-result";

class SequenceParser<T, R> extends Parser<T, R[]> {
    constructor(private parsers: Parser<T, R>[]) { super(); }

    protected tryParse(input: IInput<T>, context: IParseContext): ParseResult<T, R[]> {
        let results = this.parsers.reduce<PartialParseResult<T, R>[]>((results, subparser) => {
            var last = results[results.length - 1];
            if (isFailure(last)) {
                return results;
            } else {
                return [...results, subparser.parse(last.end, context)];
            }
        }, [ParseResult.initial(input)]);
        results.splice(0, 1);
        var last = results[results.length - 1];
        if (isSuccessful(last)) {
            return ParseResult.successful(
                input,
                last.end,
                (results as SuccessfulParseResult<T, R>[]).map(r => r.value)
            )
        } else {
            return last as FailedParseResult<T>;
        }
    }
}

export function sequence<T, R>(...parsers: Parser<T, R>[]): Parser<T, R[]> {
    if (parsers.length === 0) {
        throw new Error("Can not create a sequence with no elements");
    }

    return new SequenceParser(parsers);
}