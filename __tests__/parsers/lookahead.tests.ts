import { lookahead } from "../../parsers";
import { createArrayInput } from "../../inputs";
import { mockSuccess, mockFailure } from "../mock-parsers";
import { ParseResult } from "../../parse-result";

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
