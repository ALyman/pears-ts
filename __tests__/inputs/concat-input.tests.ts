import { createArrayInput, createConcatInput, IInput } from "../../inputs";
import { toArray } from "iter-tools";

describe("concat-input", () => {
    let array1 = createArrayInput([65, 66, 67]);
    let array2 = createArrayInput([68, 69, 70])
    let input : IInput<number> = createConcatInput(array1, array2);

    test("skip", () => {
        expect(input.skip(2)).toBe(input.next().next());
    })

    test("when values iterated", () => {
        expect(toArray(input.iterateValues())).toStrictEqual([65, 66, 67, 68, 69, 70]);
    });

    test("when consumers iterated", () => {
        let allInputs = toArray(input.iterateInputs());
        expect(allInputs.map(i => i.any())).toStrictEqual([true, true, true, true, true, true, false]);
        expect(allInputs.filter(i => i.any()).map(i => i.get())).toStrictEqual([65, 66, 67, 68, 69, 70]);
    });

    test("eof", () => {
        expect(input.eof()).toBe(input.next().next().next().next().next().next());
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