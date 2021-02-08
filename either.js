class Box {
	constructor(val) {
		this.val = val;
	}
	static of(val) {
		return new Box(val);
	}
	inspect() {
		return `Box(${this.val})`;
	}
	map(f) {
		return Box.of(f(this.val));
	}
	chain(f) {
		return f(this.val);
	}
	fold(f) {
		return f(this.val);
	}
	ap(v2) {
		return v2.map(this.val);
	}
}


class Right {
	constructor(val) {
		this.val = val;
	}
	inspect() {
		return `Right(${this.val})`;
	}
	map(f) {
		return Right.of(f(this.val));
	}
	static of(val) {
		return new Right(val);
	}
	chain(f) {
		return f(this.val);
	}
	fold(_, rightf) {
		return rightf(this.val);
	}
	ap(v2) {
		return v2.map(this.val);
	}
}
class Left {
	constructor(val) {
		this.val = val;
	}

	inspect() {
		return `Left(${this.val})`;
	}
	map(f) {
		return this;
	}
	static of(val) {
		return new Left(val);
	}
	chain(f) {
		return this;
	}
	fold(leftf, _) {
		return leftf(this.val);
	}
	ap(v2) {
		return v2.map(this.val);
	}
}

class Some {
	constructor(val) {
		this.val = val;
	}
	inspect() {
		return `Some(${this.val})`;
	}
	map(f) {
		return Some.of(f(this.val));
	}
	static of(val) {
		return new Some(val);
	}
	chain(f) {
		return f(this.val);
	}
	fold(noneVal, f) {
		return f(this.val);
	}
	getOrElse(v) {
		return this.val;
	}
	ap(v2) {
		return v2.map(this.val);
	}
}
class None {
	constructor() {}
	inspect() {
		return `None()`;
	}
	map(f) {
		return this;
	}
	static of(val) {
		return new None();
	}
	chain(f) {
		return this;
	}
	fold(noneVal, f) {
		return noneVal;
	}
	getOrElse(v) {
		return v;
	}
	ap(v2) {
		return v2.map(undefined);
	}
}

const left = x => Left.of(x);
const right = x => Right.of(x);
const either = right;

const tryCatch = f => {
	try {
		return right(f());
	} catch (err) {
		return left(err.message);
	}
};

const box = x => Box.of(x);
const some = x => Some.of(x);
const none = None.of();
const fromNullable = v => (v ? some(v) : none);
const option = fromNullable;

const l = left(new Error('fuuuu').message);
const r = right('cool cool');

const t0 = tryCatch(() => JSON.parse('jsdhfk'));
const t1 = tryCatch(() => JSON.parse('"string"'));

// const test = right({
// 	prop: right({ more: right('stuff') })
// });
// const c = test.chain(result => result.prop).chain(v => v.more).fold(
// 	x => {
// 		console.log('sorry, error:' , x );
// 	},
// 	y => {
// 		console.log( 'it worked!' , y );
// 	}
// );

// const test = some({
// 	prop: fromNullable({ more: some('stuff') })
// });
// const c = test.chain(result => result.prop).chain(v => v.more).getOrElse('shiii');

// console.log(c);

const ra = box(x => y => x + y).ap(box(1)).ap(box(2));

const lift2a = (f, a, b) => box(f).ap(box(a)).ap(box(b));

const lift2b = (f, a, b) => a.map(f).ap(b);
const lift2c = (f, a, b) => b.map(a.chain(f));

const add = x => y => x + y;
console.log(lift2a(add, 1, 2));
console.log(lift2b(add, box(1), box(2)));
console.log(lift2c(add, box(1), box(2)));

//
// lift2a( )

// console.log(ra.fold(x => `boxie ${x}`));
// const s = fromNullable('coolio');
// console.log([l, r, t0, t1, s].map( m => m.map(x=>'OK'+x)));
