export type Fn2<I1, I2, O> = (p0: I1, p1: I2) => O;
export interface Functor2<E, V> {
	map<R>(f: Fn1<V, R>): Functor2<E, R>;
}
export interface Monad2<E, V> {
	chain<R>(f: Fn1<V, Monad2<E, R>>): Monad2<E, R>;
}
export interface Foldable2<E, V> {
	fold<R>(onLeft: Fn1<E, R>, onRight: Fn1<V, R>): R;
}
export interface Applicative2<E, V> {
	ap<O>(v: Applicative2<E, V>): Applicative2<E, O>;
}
export interface Traversable2<E, V> {}
