import { sequence } from "../../parsers";
import { createArrayInput } from "../../inputs";
import { ParseResult } from "../../parse-result";
import { successParser, failureParser } from "../mock-parsers";

describe("parsers.sequence", () => {
    test("when given no subparsers, throws", () =>{
        expect(() => sequence()).toThrowError("Can not create a sequence with no elements")
    })

    test("when the input matches", () => {
        var input = createArrayInput([1, 2, 3]);
        var p = sequence(successParser(1), successParser(2));
        let result = p.parse(input);
        expect(result).toStrictEqual(ParseResult.successful(input, input.next().next(), [1,2]));
    });

    test("when the input does not match", () => {
        var input = createArrayInput([1, 2, 3]);
        var p = sequence(successParser(1), failureParser("ERROR"), successParser(3));
        let result = p.parse(input);
        expect(result).toStrictEqual(ParseResult.failure(input.next(), "ERROR"));
    });
})
