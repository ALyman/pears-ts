import { IInput } from "../inputs";
import { Parser, IParseContext } from "./parser-base";
import { ParseResult, SuccessfulParseResult, isFailure } from "../parse-result";

class ManyParser<T, R> extends Parser<T, R[]> {
    constructor(private subparser: Parser<T, R>, private minimum: number, private maximum: number) { super(); }

    protected tryParse(input: IInput<T>, context: IParseContext): ParseResult<T, R[]> {
        let results = [];

        for (var last = ParseResult.initial(input); results.length < this.maximum; last = next) {
            var next = this.subparser.parse(last.end, context);
            if (isFailure(next)) {
                if (results.length < this.minimum) {
                    return next;
                }
                break;
            } else {
                results.push(next);
            }
            if (next.start == next.end && results.length >= this.minimum) {
                break;
            }
        }

        return ParseResult.successful(
            input,
            last.end,
            (results as SuccessfulParseResult<T, R>[]).map(r => r.value)
        )
    }
}

export function many<T, R>(parser: Parser<T, R>, minimum: number = 0, maximum: number = Number.MAX_SAFE_INTEGER): Parser<T, R[]> {
    if (minimum > maximum) { 
        throw new Error("minimum must be less than or equal to maximum");
    }
    if (minimum < 0) { 
        throw new Error("minimum must be a non-negative number");
    }
    if (maximum <= 0) { 
        throw new Error("maximum must be a positive number");
    }
    return new ManyParser(parser, minimum, maximum);
}