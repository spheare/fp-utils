class Task {
	constructor(fn) {
		this.fn = fn;
	}
	static from(v) {
		return new Task(v);
	}
	static of(v) {
		return new Task( (rej,acc) => acc(v) );
	}
	static reject(v) {
		return new Task( (rej,acc) => rej(v) );
	}
	map(f) {
		return new Task((rej, acc) => this.fork(rej, x => acc(f(x))));
	}
	chain(f) {
		return new Task((rej, acc) => this.fork(rej, x => f(x).fork(rej, acc)));
	}
	fork(rej, acc) {
		return this.fn(rej, acc);
	}
}

const missiles = (reject, res) => {
	res('missiles');
};
const t = Task.of(1);
t.map(x => x + '!!').fn(e => console.error('shiii', e), a => console.log(a));
