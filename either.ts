type Fn<I, O> = (p0: I) => O;

// E: Eror, V=Value

interface Mappable<E, V> {
	map<R>(f: Fn<V, R>): Mappable<E, R>;
}

interface Chainable<E, V> {
	chain<R>(f: Fn<V, Chainable<E, R>>): Chainable<E, R>;
}

interface Foldable<E, V> {
	fold<R>(onLeft: Fn<E, R>, onRight: Fn<V, R>): R;
}

interface Applicative<E, V> {
	ap<O>(v: Applicative<E, V>): Applicative<E, O>;
}

class Right<E, V> implements Mappable<E, V>, Chainable<E, V>, Foldable<E, V>, Applicative<E, V> {
	constructor(private val: V) {}
	inspect() {
		return `Right(${this.val})`;
	}
	static of<E, V>(val: V): Either<E, V> {
		return new Right(val);
	}

	map<R>(f: Fn<V, R>): Either<E, R> {
		return Right.of(f(this.val));
	}

	chain<R>(f: Fn<V, Either<E, R>>): Either<E, R> {
		return f(this.val);
	}

	fold<R>(onLeft: Fn<E, R>, onRight: Fn<V, R>): R {
		return onRight(this.val);
	}

	ap<O>(v: Either<E, V>): Either<E, O> {
		if (typeof this.val === 'function') return v.map(this.val as Fn<V, O>);

		throw new Error('not supported');
	}
}

class Left<E, V> implements Mappable<E, V>, Chainable<E, V>, Foldable<E, V>, Applicative<E, V> {
	constructor(private val: E) {}
	inspect() {
		return `Left(${this.val})`;
	}
	static of<E, V>(val: E): Either<E, V> {
		return new Left(val);
	}

	map<R>(f: Fn<V, R>): Either<E, R> {
		return Left.of(this.val);
	}

	chain<R>(f: Fn<V, Either<E, R>>): Either<E, R> {
		return Left.of(this.val);
	}

	fold<R>(onLeft: Fn<E, R>, onRight: Fn<V, R>): R {
		return onLeft(this.val);
	}

	ap<O>(v: Either<E, V>): Either<E, O> {
		if (typeof this.val === 'function') return v.map(this.val as Fn<V, O>);

		throw new Error('not supported');
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
