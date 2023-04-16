class IO {
	get unsafePerformIO() {
		return this.fn;
	}

	constructor(private readonly fn) {}

	inspect() {
		return 'IO(?)';
	}
	// ----- Pointed IO
	static of(x) {
		return new IO(() => x);
	}
	// ----- Functor IO
	map(fn) {
		return new IO(() => fn(this.unsafePerformIO()));
	}
	// ----- Applicative IO
	ap(f) {
		return this.chain(fn => f.map(fn));
	}
	// ----- Monad IO
	chain(fn) {
		return this.map(fn).join();
	}
	join() {
		return new IO(() => this.unsafePerformIO().unsafePerformIO());
	}
}
