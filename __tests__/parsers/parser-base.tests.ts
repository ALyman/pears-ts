import { Parser, IParseContext } from "../../src/parsers";
import { ParseResult } from "../../src/parse-result";
import { IInput } from "../../src/inputs/input";
import { createArrayInput } from "../../src/inputs/array-input";

describe("parsers.parser", () => {
    test("when given no subparsers, throws", () => {
        const values = [1, 2, 3];
        var input = createArrayInput(values);
        var savedContext: IParseContext | undefined = undefined;

        let inputLog: IInput<number>[] = [];

        class TestParser extends Parser<number, number> {
            protected tryParse(
                input: IInput<number>,
                context: IParseContext
            ): ParseResult<number, number> {
                inputLog.push(input);
                savedContext = context;
                return ParseResult.failure(input, "Expected");
            }
        }

        let p = new TestParser();
        expect(p.parse(input)).toStrictEqual(ParseResult.failure(input, "Expected"));
        expect(p.parse(input, savedContext)).toStrictEqual(ParseResult.failure(input, "Expected"));
        expect(p.parse(input.next(), savedContext)).toStrictEqual(ParseResult.failure(input.next(), "Expected"));
        expect(p.parse(input.next(), savedContext)).toStrictEqual(ParseResult.failure(input.next(), "Expected"));

        expect(inputLog).toStrictEqual([input, input.next()]);
    });
});
