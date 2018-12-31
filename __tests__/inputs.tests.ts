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
    const input = factory(...args);

    test("skip", () => {
        expect(input.skip(2)).toBe(input.next().next());
    })

    test("when values iterated", () => {
        expect(toArray(input.iterateValues())).toStrictEqual([65, 66, 67]);
    });

    test("when consumers iterated", () => {
        let allInputs = toArray(input.iterateInputs());
        expect(allInputs.map(i => i.any())).toStrictEqual([true, true, true, false]);
        expect(allInputs.filter(i => i.any()).map(i => i.get())).toStrictEqual([65, 66, 67]);
    });

    test("eof", () => {
        expect(input.eof()).toBe(input.next().next().next());
    });

    test("returns same consumer", () => {
        expect(input.next()).toBe(input.next());
    });

    test("get throws if past eof", () => {
        let cur = input;
        for (; cur.any(); cur = cur.next());

        expect(() => cur.get()).toThrowError("No more input");
    });
});