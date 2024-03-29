/** @format */
//
//	Hele lightweight Nothing / Just implementatie v2
//

import { Functor, Monad, Foldable, LazyFoldable, Applicative, Fn1, Fn0 } from './Functor';

// interface MonadicFunctor<T> {
// 	// static from<I>(val: B): Monadic<B>;
// 	map<R>(f: Fn<T, R>): MonadicFunctor<R>;
// 	chain<R>(f: Fn<T, MonadicFunctor<R>>): MonadicFunctor<R>;
// 	fold<R>(nothingValue: R, onJust: Fn<T, R>): R;
// 	foldL<R>(onNothing: Action<R>, onJust: Fn<T, R>): R;
// }

// interface Applicative<T> {
// 	ap<R>(v: Applicative<R>): Applicative<T>;
// }

interface MaybeQuery {
	isSome(): boolean;
	isNone(): boolean;
}

interface MaybeExtensions<T> {
	or<R>(nothingValue: R): T | R;
	then<R>(onJust: Fn1<T, R>): void;
}

export type Maybe<T> = Just<T> | Nothing<T>;

class Just<T> implements MaybeQuery, MaybeExtensions<T>, Functor<T>, Monad<T>, Foldable<T>, LazyFoldable<T>, Applicative<T> {
	private constructor(protected val: T) {}

	static from<T>(val: T): Maybe<T> {
		// niet helemaal pure maar wel handiger:
		//	Just.from(null) zou Just[null] moeten zijn, maar is hier Nothing[null]
		//	Geeft ons (bijna) gratis nullMapping doorheen de hele ketting
		return Just.fromNullable(val);
		// ipv: return new Just(val);
	}

	static fromNullable<T>(val: T): Maybe<T> {
		return val === null || val === void 0 ? Nothing.from(val) : new Just(val);
	}

	static fromFalsy<T>(val: T): Maybe<T> {
		return !!val ? new Just(val) : Nothing.from(val);
	}

	map<R>(f: Fn1<NonNullable<T>, R>): Maybe<R> {
		return Just.from(f(this.val as NonNullable<T>));
	}
	mapNullable<R>(f: Fn1<NonNullable<T>, R>): Maybe<R> {
		return Just.fromNullable(f(this.val as NonNullable<T>));
	}

	chain<R>(f: Fn1<NonNullable<T>, Maybe<R>>): Maybe<R> {
		return f(this.val as NonNullable<T>);
	}

	fold<R>(noneValue: R, onJust: Fn1<NonNullable<T>, R>): R {
		return onJust(this.val as NonNullable<T>);
	}

	foldL<R>(onNone: Fn0<R>, onJust: Fn1<NonNullable<T>, R>): R {
		return onJust(this.val as NonNullable<T>);
	}

	isSome(): boolean {
		return true;
	}

	isNone(): boolean {
		return false;
	}

	or<R>(_: R): T | R {
		return this.val;
	}

	alt<R>(_: Maybe<R>): Maybe<T> | Maybe<R> {
		return Just.from(this.val);
	}

	then(onJust: Fn1<T, void>): void {
		return onJust(this.val);
	}

	ap<R, S>(v: Maybe<R>): Maybe<S> {
		if (typeof this.val === 'function') {
			const fn = this.val as Function;
			return v.map(x => fn(x));
		} else throw new Error('not supported');
	}
}
class Nothing<T> implements MaybeQuery, MaybeExtensions<T>, Functor<T>, Monad<T>, Foldable<T>, LazyFoldable<T>, Applicative<T> {
	private constructor(_?: T) {}

	static from<T>(val?: T): Nothing<T> {
		return new Nothing(val);
	}
	static fromNullable<T>(val?: T): Nothing<T> {
		return new Nothing(val);
	}

	map<R>(_: Fn1<NonNullable<T>, R>): Maybe<R> {
		return Nothing.from<R>();
	}

	mapNullable<R>(_: Fn1<NonNullable<T>, R>): Maybe<R> {
		return Nothing.fromNullable<R>();
	}

	chain<R>(_: Fn1<NonNullable<T>, Maybe<R>>): Maybe<R> {
		return Nothing.from<R>();
	}

	fold<R>(nothingValue: R, _: Fn1<NonNullable<T>, R>): R {
		return nothingValue;
	}

	foldL<R>(onNothing: Fn0<R>, _: Fn1<NonNullable<T>, R>): R {
		return onNothing();
	}

	isSome(): boolean {
		return false;
	}
	isNone(): boolean {
		return true;
	}

	or<R>(nothingValue: R): T | R {
		return nothingValue;
	}

	alt<R>(nothingMaybe: Maybe<R>): Maybe<T> | Maybe<R> {
		return nothingMaybe;
	}

	then(_: Fn1<T, void>): void {
		return; // do nothing
	}

	ap<R, S>(v: Maybe<R>): Maybe<S> {
		return Nothing.from<S>();
	}
}

export const just = <T>(x: T) => Just.from(x);
export const nothing = <T>(x: T) => Nothing.from(x);
export const maybe = <T>(x: T) => Just.fromNullable(x);
export const fromFalsy = <T>(x: T) => Just.fromFalsy(x);
export const NOTHING = nothing(null);

// export const zipMaybe2 /*: <T1, T2>(m1: Maybe<T1>, m2: Maybe<T2>) => Maybe<[T1, T2]> */ = <T1, T2>(
//     m1: Maybe<T1> | Just<T1> | Nothing<T1>,
//     m2: Maybe<T2> | Just<T2> | Nothing<T2>
// ) => m1.chain(v1 => m2.map(v2 => [v1, v2]));
export const zipMaybe2 = <T1, T2>(m1: Maybe<T1>, m2: Maybe<T2>) =>
	maybe(a => b => [a, b])
		.ap(m1)
		.ap(m2); // == liftA2

// export const zipMaybe3 /*: <T1, T2, T3>(m1: Maybe<T1>, m2: Maybe<T2>, m3: Maybe<T3>) => Maybe<[T1, T2, T3]> */ = <
//     T1,
//     T2,
//     T3
// >(
//     m1: Maybe<T1>,
//     m2: Maybe<T2>,
//     m3: Maybe<T3>
// ) => m1.chain(v1 => m2.chain(v2 => m3.map(v3 => [v1, v2, v3])));
export const zipMaybe3 = <T1, T2, T3>(m1: Maybe<T1>, m2: Maybe<T2>, m3: Maybe<T3>) =>
	maybe(a => b => c => [a, b, c])
		.ap(m1)
		.ap(m2)
		.ap(m3); // == liftA3

// export interface OptionLike<T> {
//     fold<R>(nothingValue: R, _: Fn<T, R>): R;
// }
// export const optionToMaybe = <T>(opt: OptionLike<T>) => opt.fold<Maybe<T>>(NOTHING, maybe);
