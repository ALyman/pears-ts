import { equal } from "../../src/parsers";
import { createArrayInput } from "../../src/inputs";
import { ParseResult } from "../../src/parse-result";

describe("parsers.equals", () => {
    test("when the input matches", () => {
        const values = [1,2,3];
        var input = createArrayInput(values);

        let p = equal(1);
        let result = p.parse(input);

        expect(result).toStrictEqual(ParseResult.successful(input, input.next(), 1));
    });

    test("when the input does not match", () => {
        const values = [1,2,3];
        var input = createArrayInput(values);

        let p = equal(2);
        let result = p.parse(input);

        expect(result).toStrictEqual(ParseResult.failure(input, "unexpected '1', expected '2'"));
    });
    
    test("when the input has ended", () => {
        const values = [1,2,3];
        var input = createArrayInput(values, 4);

        let p = equal(4);
        let result = p.parse(input);

        expect(result).toStrictEqual(ParseResult.failure(input, "unexpected end of file, expected '4'"));
    });
})
