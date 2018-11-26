import { many, Parser } from "../../parsers";
import { createArrayInput } from "../../inputs";
import { ParseResult } from "../../parse-result";
import { successParser, mockParser } from "../mock-parsers";

describe.each([
    function wrapped(parser : Parser<number, number>, minimum?: number, maximum?: number) {
        return many(parser, minimum, maximum);
    },
    function chained(parser : Parser<number, number>, minimum?: number, maximum?: number) {
        return parser.many(minimum, maximum);
    },
])("parsers.many(%O)", (makeMany : (parser : Parser<number, number>, minimum?: number, maximum?: number) => Parser<number, number[]>) => {
    test("minimum must be less than or equal to maximum", () =>{
        expect(() => makeMany(successParser(1), 3, 2)).toThrowError("minimum must be less than or equal to maximum")
    })

    test("minimum must be a non-negative number", () =>{
        expect(() => makeMany(successParser(1), -2)).toThrowError("minimum must be a non-negative number")
    })

    test("maximum must be a positive number", () =>{
        expect(() => makeMany(successParser(1), 0, 0)).toThrowError("maximum must be a positive number")
    })

    test("when the input matches", () => {
        var input = createArrayInput([1, 2, 3]);
        
        var p = makeMany(mockParser(
            new Map([
                [ input.skip(0), ParseResult.successful(input.skip(0), input.skip(1), 1) as ParseResult<number, number> ],
                [ input.skip(1), ParseResult.successful(input.skip(1), input.skip(2), 2) as ParseResult<number, number> ],
                [ input.skip(2), ParseResult.successful(input.skip(2), input.skip(3), 3) as ParseResult<number, number> ],
                [ input.skip(3), ParseResult.failure(input.skip(3), "Expected") as ParseResult<number, number> ],
            ])
        ));
        let result = p.parse(input);
        expect(result).toStrictEqual(ParseResult.successful(input, input.skip(3), [1,2,3]));
    });

    test("when the subparser matches empty", () => {
        var input = createArrayInput([1, 2, 3]);
        
        var p = makeMany(mockParser(
            new Map([
                [ input.skip(0), ParseResult.successful(input.skip(0), input.skip(0), 1) as ParseResult<number, number> ],
            ])
        ), 2);
        let result = p.parse(input);
        expect(result).toStrictEqual(ParseResult.successful(input, input, [1,1]));
    });
    
    test("when the input matches w/ minimum", () => {
        var input = createArrayInput([1, 2, 3]);
        
        var p = makeMany(mockParser(
            new Map([
                [ input.skip(0), ParseResult.successful(input.skip(0), input.skip(1), 1) as ParseResult<number, number> ],
                [ input.skip(1), ParseResult.successful(input.skip(1), input.skip(2), 2) as ParseResult<number, number> ],
                [ input.skip(2), ParseResult.successful(input.skip(2), input.skip(3), 3) as ParseResult<number, number> ],
                [ input.skip(3), ParseResult.failure(input.skip(3), "Expected") as ParseResult<number, number> ],
            ])
        ));
        let result = p.parse(input);
        expect(result).toStrictEqual(ParseResult.successful(input, input.skip(3), [1,2,3]));
    });

    test("when the input doesnt match", () => {
        var input = createArrayInput([1, 2, 3]);
        
        var p = makeMany(mockParser(
            new Map([
                [ input.skip(0), ParseResult.failure(input.skip(0), "Expected") as ParseResult<number, number> ],
            ])
        ));
        let result = p.parse(input);
        expect(result).toStrictEqual(ParseResult.successful(input, input, []));
    });
    
    test("when the input doesnt match w/ minimum", () => {
        var input = createArrayInput([1, 2, 3]);
        
        var p = makeMany(mockParser(
            new Map([
                [ input.skip(0), ParseResult.failure(input.skip(0), "Expected") as ParseResult<number, number> ],
            ])
        ), 1);
        let result = p.parse(input);
        expect(result).toStrictEqual(ParseResult.failure(input, "Expected"));
    });
})
