import { alternative } from "../../src/parsers";
import { createArrayInput } from "../../src/inputs";
import { ParseResult } from "../../src/parse-result";

import { mockSuccess, mockFailure } from "../mock-parsers";

describe("parsers.alternative", () => {
    test("when given no subparsers, throws", () => {
        expect(() => alternative()).toThrowError("Can not create a alternative with no elements")
    })

    test("when the input matches", () => {
        var input = createArrayInput([1, 2, 3]);
        var p = alternative(mockSuccess(1), mockSuccess(2));
        let result = p.parse(input);
        expect(result).toStrictEqual(ParseResult.successful(input, input.next(), 1));
    });

    test("when the input does not match the first few", () => {
        var input = createArrayInput([1, 2, 3]);
        var p = alternative<number, number>(mockFailure("1"), mockFailure("2"), mockSuccess(3));
        let result = p.parse(input);
        expect(result).toStrictEqual(ParseResult.successful(input, input.next(), 3));
    });

    test("when the input does not match", () => {
        var input = createArrayInput([1, 2, 3]);
        var p = alternative<number, number>(mockFailure("1"), mockFailure("2"));
        let result = p.parse(input);
        expect(async () => {
            await p.parse(input);
        })
        expect(result).toStrictEqual(ParseResult.failure(input, "2"));
    });
})
