import { Applicative, Fn0, Fn1, Functor, Monad, MonadJoin } from './Functor';

export class IO<T> implements Functor<T>, Monad<T>, MonadJoin, Applicative<T> {
	get unsafePerformIO(): Fn0<T> {
		return this.fn;
	}

	constructor(private readonly fn: Fn0<T>) {}

	inspect() {
		return 'IO(?)';
	}
	// ----- Pointed IO
	static of(x) {
		return new IO(() => x);
	}

	// ----- Functor IO

	map<R>(f: Fn1<T, R>): IO<R> {
		return new IO(() => f(this.unsafePerformIO()));
	}

	// ------ Monad
	chain<R>(f: Fn1<T, IO<R>>): IO<R> {
		return this.map(f).join();
	}

	join<R>(): IO<R> {
		return new IO(() => (this.unsafePerformIO() as IO<R>).unsafePerformIO());
	}

	// ----- Applicative IO
	ap<O>(ioParam: IO<O>): IO<T> {
		return this.chain(value => ioParam.map(value as Fn1<O, T>));
	}
}
