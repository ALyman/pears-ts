import { IInput } from "../inputs";
import { ParseResult } from "../parse-result";

const PARSE_CONTEXT_MARKER = Symbol();

export interface IParseContext {
    [PARSE_CONTEXT_MARKER]: never;
}

class ParseContext<T> implements IParseContext {
    public readonly memoize: Map<Parser<T, any>, Map<IInput<T>, ParseResult<T, any>>> = new Map();

    [PARSE_CONTEXT_MARKER]: never;
}

export abstract class Parser<T, R> {
    public parse(input: IInput<T>): ParseResult<T, R>;
    public parse(input: IInput<T>, context: IParseContext | undefined): ParseResult<T, R>;
    public parse(input: IInput<T>, context?: IParseContext): ParseResult<T, R> {
        let typedContext = context instanceof ParseContext ? context : new ParseContext<T>();

        let memos = typedContext.memoize.get(this);
        if (!memos) { typedContext.memoize.set(this, memos = new Map()); }
        let result = memos.get(input);
        if (!result) {
            result = this.tryParse(input, typedContext);
            memos.set(input, result);
        }
        return result;
    }

    protected abstract tryParse(input: IInput<T>, context: IParseContext): ParseResult<T, R>;

    public map<U>(fn: (value: R) => U): Parser<T, U> {
        return map(this, fn);
    }

    public many(minimum?: number, maximum?: number): Parser<T, R[]> {
        return many(this, minimum, maximum);
    }
}

import { map } from "./map";
import { many } from "./many";
