import { sequence } from "../../src/parsers";
import { createArrayInput } from "../../src/inputs";
import { ParseResult } from "../../src/parse-result";
import { mockSuccess, mockFailure } from "../mock-parsers";

describe("parsers.sequence", () => {
    test("when given no subparsers, throws", () =>{
        expect(() => sequence()).toThrowError("Can not create a sequence with no elements")
    })

    test("when the input matches", () => {
        var input = createArrayInput([1, 2, 3]);
        var p = sequence(mockSuccess(1), mockSuccess(2));
        let result = p.parse(input);
        expect(result).toStrictEqual(ParseResult.successful(input, input.next().next(), [1,2]));
    });

    test("when the input does not match", () => {
        var input = createArrayInput([1, 2, 3]);
        var p = sequence(mockSuccess(1), mockFailure("ERROR"), mockSuccess(3));
        let result = p.parse(input);
        expect(result).toStrictEqual(ParseResult.failure(input.next(), "ERROR"));
    });
})
