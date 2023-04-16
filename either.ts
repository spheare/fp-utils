import { Functor2, Monad2, Foldable2, Applicative2, Traversable2, Fn1 } from './Functor2';

// E: Eror, V=Value

class Right<E, V> implements Functor2<E, V>, Monad2<E, V>, Foldable2<E, V>, Applicative2<E, V>, Traversable2<E, V> {
	constructor(private val: V) {}
	inspect() {
		return `Right(${this.val})`;
	}
	static of<E, V>(val: V): Either<E, V> {
		return new Right(val);
	}

	map<R>(f: Fn1<V, R>): Either<E, R> {
		return Right.of(f(this.val));
	}

	chain<R>(f: Fn1<V, Either<E, R>>): Either<E, R> {
		return f(this.val);
	}

	fold<R>(onLeft: Fn1<E, R>, onRight: Fn1<V, R>): R {
		return onRight(this.val);
	}

	ap<O>(v: Either<E, V>): Either<E, O> {
		if (typeof this.val === 'function') return v.map(this.val as Fn1<V, O>);

		throw new Error('not supported');
	}

	// // ----- Traversable (Either a)
	// sequence<T>(of: Fn<T, Either<E, V>>) {
	// 	return this.traverse(Right.of, x => x);
	// }

	// traverse<T>(of: Fn<T, Either<E, T>>, fn: Fn<Either<E, T>, Either<E, V>>): Either<E, V> {
	// 	return fn(this).map(Right.of);
	// }
}

class Left<E, V> implements Functor2<E, V>, Monad2<E, V>, Foldable2<E, V>, Applicative2<E, V> {
	constructor(private val: E) {}
	inspect() {
		return `Left(${this.val})`;
	}
	static of<E, V>(val: E): Either<E, V> {
		return new Left(val);
	}

	map<R>(f: Fn1<V, R>): Either<E, R> {
		return Left.of(this.val);
	}

	chain<R>(f: Fn1<V, Either<E, R>>): Either<E, R> {
		return Left.of(this.val);
	}

	fold<R>(onLeft: Fn1<E, R>, onRight: Fn1<V, R>): R {
		return onLeft(this.val);
	}

	ap<O>(v: Either<E, V>): Either<E, O> {
		return Left.of(this.val);
	}
}

export type Either<E, V> = Left<E, V> | Right<E, V>;

export const left = Left.of;
export const right = Right.of;
export const either = Right.of;

export const tryCatch = f => {
	try {
		return right(f());
	} catch (err) {
		return left(err.message);
	}
};
