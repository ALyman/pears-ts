const NEXT_CACHE = Symbol();

export abstract class IInput<T> {
    private [NEXT_CACHE]?: IInput<T>;
    public abstract any(): boolean;
    public abstract get(): T;

    public next(): IInput<T> {
        let cached = this[NEXT_CACHE];
        if (!cached) {
            this[NEXT_CACHE] = cached = this.createNext();
        }
        return cached;
    }

    protected abstract createNext(): IInput<T>;

    public skip(n: number): IInput<T> {
        for (var i: IInput<T> = this, j: number = 0; i.any() && j < n; j++, i = i.next());
        return i;
    }

    public eof(): IInput<T> {
        for (var i: IInput<T> = this; i.any(); i = i.next());
        return i;
    }

    public *iterateValues() {
        let input: IInput<T> = this;
        while (input.any()) {
            yield input.get();
            input = input.next();
        }
    }

    public *iterateInputs() {
        let input: IInput<T> = this;
        while (input.any()) {
            yield input;
            input = input.next();
        }
        yield input;
    }
}