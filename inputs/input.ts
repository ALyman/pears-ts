export abstract class IInput<T> {
    public abstract any(): boolean;
    public abstract get(): T;
    public abstract next(): IInput<T>;
}