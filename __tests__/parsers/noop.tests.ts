import { noop, success, fail } from "../../parsers";
import { createArrayInput } from "../../inputs";
import { ParseResult } from "../../parse-result";

describe("parsers.noop", () => {
    test("noop succeeds", () => {
        const values = [1, 2, 3];
        var input = createArrayInput(values);

        let p = noop();
        let result = p.parse(input);

        expect(result).toStrictEqual(ParseResult.successful(input, input, void 0));
    });

    test("success succeeds", () => {
        const values = [1, 2, 3];
        var input = createArrayInput(values);

        let p = success(3);
        let result = p.parse(input);

        expect(result).toStrictEqual(ParseResult.successful(input, input, 3));
    });

    test("fail fails", () => {
        const values = [1, 2, 3];
        var input = createArrayInput(values);

        let p = fail("ERROR");
        let result = p.parse(input);

        expect(result).toStrictEqual(ParseResult.failure(input, "ERROR"));
    });
})
