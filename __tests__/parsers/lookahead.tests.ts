import { lookahead } from "../../src/parsers";
import { createArrayInput } from "../../src/inputs";
import { mockSuccess, mockFailure } from "../mock-parsers";
import { ParseResult } from "../../src/parse-result";

describe("parsers.lookahead", () => {
    test("when the input matches", () => {
        const values = [1, 2, 3];
        var input = createArrayInput(values);

        let p = lookahead(mockSuccess(1));
        let result = p.parse(input);

        expect(result).toStrictEqual(ParseResult.successful(input, input, 1));
    });

    test("when the input does not match", () => {
        const values = [1, 2, 3];
        var input = createArrayInput(values);

        let p = lookahead(mockFailure("ERROR"));
        let result = p.parse(input);

        expect(result).toStrictEqual(ParseResult.failure(input, "ERROR"));
    });
})
