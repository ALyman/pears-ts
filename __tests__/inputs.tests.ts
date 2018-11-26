import { toArray } from "iter-tools";
import { IInput, createBufferInput, createArrayInput, createStringInput } from "../inputs";

describe.each([
    [createBufferInput, Buffer.from([65, 66, 67])],
    [createBufferInput, Buffer.from([65, 66, 67]), 0],
    [createBufferInput, Buffer.from([65, 66, 67]), 0, 3],
    [createBufferInput, Buffer.from([64, 65, 66, 67, 68]), 1, 4],

    [createArrayInput, ([65, 66, 67])],
    [createArrayInput, ([65, 66, 67]), 0],
    [createArrayInput, ([65, 66, 67]), 0, 3],
    [createArrayInput, ([64, 65, 66, 67, 68]), 1, 4],

    [createStringInput, "ABC"],
    [createStringInput, "ABC",0],
    [createStringInput, "ABC", 0, 3],
    [createStringInput, "zABCD", 1, 4],
])("Input(%O, %O, %O, %O)", (factory: (...args: any[]) => IInput<number>, ...args: any[]) => {
    test("skip", () => {
        let input = factory(...args);

        expect(input.skip(2)).toBe(input.next().next());
    })

    test("when values iterated", () => {
        let input = factory(...args);
        expect(toArray(input.iterateValues())).toStrictEqual([65, 66, 67]);
    });

    test("when consumers iterated", () => {
        let input = factory(...args);
        let allInputs = toArray(input.iterateInputs());
        expect(allInputs.map(i => i.any())).toStrictEqual([true, true, true, false]);
        expect(allInputs.filter(i => i.any()).map(i => i.get())).toStrictEqual([65, 66, 67]);
    });

    test("eof", () => {
        let input = factory(...args);
        expect(input.eof()).toBe(input.next().next().next());
    });

    test("returns same consumer", () => {
        let input = factory(...args);
        expect(input.next()).toBe(input.next());
    });

    test("get throws if past eof", () => {
        let input = factory(...args);
        for (; input.any(); input = input.next());

        expect(() => input.get()).toThrowError("No more input");
    });
});