export type Action<T> = (state: T) => T;

export type State<T> = [T, (newV: T) => void];
