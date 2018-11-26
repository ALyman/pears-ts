import { map, Parser } from "../../parsers";
import { createArrayInput } from "../../inputs";
import { successParser, failureParser } from "../mock-parsers";
import { ParseResult } from "../../parse-result";

describe.each([
    function wrapped(parser : Parser<number, number>, fn: (value:number) => number) {
        return map(parser, fn);
    },
    function chained(parser : Parser<number, number>, fn: (value:number) => number) {
        return parser.map(fn);
    },
])("parsers.map(%O)", (makeMap : (parser : Parser<number, number>, fn: (value:number) => number) => Parser<number, number>) => {
    test("when the input matches", () => {
        const values = [1, 2, 3];
        var input = createArrayInput(values);

        let p = makeMap(successParser(1), n => n + 1);
        let result = p.parse(input);

        expect(result).toStrictEqual(ParseResult.successful(input, input.next(), 2));
    });

    test("when the input does not match", () => {
        const values = [1, 2, 3];
        var input = createArrayInput(values);

        let p = makeMap(failureParser<number>("ERROR"), n => n + 1);
        let result = p.parse(input);

        expect(result).toStrictEqual(ParseResult.failure(input, "ERROR"));
    });

    test("when the mapping function throws", () => {
        const values = [1, 2, 3];
        var input = createArrayInput(values);

        let thrownError = new Error();
        let p = makeMap(successParser(1), () => { throw thrownError });
        let result = p.parse(input);

        expect(result).toStrictEqual(ParseResult.failure(input, thrownError));
    });
})
