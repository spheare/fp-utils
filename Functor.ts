export type Fn0<O> = () => O;
export type Fn1<I, O> = (p0: I) => O;

// E: Eror, V=Value
export interface Functor<V> {
	map<R>(f: Fn1<V, R>): Functor<R>;
}
export interface Monad<V> {
	chain<R>(f: Fn1<V, Monad<R>>): Monad<R>;
}
export interface MonadJoin {
	join<R>(): Monad<R>;
}

export interface Foldable<V> {
	fold<R>(nothingValue: R, onJust: Fn1<V, R>): R;
}
export interface LazyFoldable<V> {
	foldL<R>(onLeft: Fn0<R>, onRight: Fn1<V, R>): R;
}

export interface Applicative<V> {
	ap<O, P>(v: Applicative<O>): Applicative<P>;
}
export interface Traversable<V> {}
