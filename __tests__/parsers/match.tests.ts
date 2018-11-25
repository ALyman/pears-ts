import { match } from "../../src/parsers";
import { createArrayInput } from "../../src/inputs";
import { ParseResult } from "../../src/parse-result";

describe("parsers.match", () => {
    test("when the input matches", () => {
        const values = [1, 2, 3];
        var input = createArrayInput(values);

        let p = match(function IS_ONE(i: number) { return i === 1 });
        let result = p.parse(input);

        expect(result).toStrictEqual(ParseResult.successful(input, input.next(), 1));
    });

    test("when the input does not match", () => {
        const values = [1, 2, 3];
        var input = createArrayInput(values);

        let p = match(function IS_TWO(i: number) { return i === 2 });
        let result = p.parse(input);

        expect(result).toStrictEqual(ParseResult.failure(input, "unexpected '1', expected IS_TWO"));
    });

    test("when the input has ended", () => {
        const values = [1, 2, 3];
        var input = createArrayInput(values, 4);

        let p = match(function IS_FOUR(i: number) { return i === 4 });
        let result = p.parse(input);

        expect(result).toStrictEqual(ParseResult.failure(input, "unexpected end of file, expected IS_FOUR"));
    });
})
