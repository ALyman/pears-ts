import { alternative } from "../../parsers";
import { createArrayInput } from "../../inputs";
import { ParseResult } from "../../parse-result";

import { successParser, failureParser } from "../mock-parsers";

describe("parsers.alternative", () => {
    test("when given no subparsers, throws", () => {
        expect(() => alternative()).toThrowError("Can not create a alternative with no elements")
    })

    test("when the input matches", () => {
        var input = createArrayInput([1, 2, 3]);
        var p = alternative(successParser(1), successParser(2));
        let result = p.parse(input);
        expect(result).toStrictEqual(ParseResult.successful(input, input.next(), 1));
    });

    test("when the input does not match the first few", () => {
        var input = createArrayInput([1, 2, 3]);
        var p = alternative<number, number>(failureParser("1"), failureParser("2"), successParser(3));
        let result = p.parse(input);
        expect(result).toStrictEqual(ParseResult.successful(input, input.next(), 3));
    });

    test("when the input does not match", () => {
        var input = createArrayInput([1, 2, 3]);
        var p = alternative<number, number>(failureParser("1"), failureParser("2"));
        let result = p.parse(input);
        expect(async () => {
            await p.parse(input);
        })
        expect(result).toStrictEqual(ParseResult.failure(input, "2"));
    });
})
