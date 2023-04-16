import { Fn1, Functor, Monad } from './Functor';
import { Fn2 } from './Functor2';

export type TaskAccept<T, O> = Fn1<T, O>;
export type TaskReject<T, O> = Fn1<T, O>;
export type TaskParamFn<T, A, R> = (reject: TaskReject<R, T>, accept: TaskAccept<A, T>) => T;

export class Task<T, A, R> {
	constructor(private readonly fn: TaskParamFn<T, A, R>) {}

	static from<T, A, R>(fn: TaskParamFn<T, A, R>) {
		return new Task(fn);
	}
	static of<O, P>(value: O) {
		return new Task<P, O, unknown>((rej, acc) => acc(value));
	}
	static reject<O, P>(value: O) {
		return new Task<P, unknown, O>((rej, acc) => rej(value));
	}
	map<B>(f: Fn1<A, B>): Task<T, B, R> {
		const fn = (rej: TaskReject<R, T>, acc: TaskAccept<B, T>) => this.fork(rej, x => acc(f(x)));
		return new Task(fn);
	}

	chain<B>(f: Fn1<A, Task<T, B, R>>): Task<T, B, R> {
		const fn = (rej: TaskReject<R, T>, acc: TaskAccept<B, T>) => this.fork(rej, x => f(x).fork(rej, acc));
		return new Task(fn);
	}

	fork(rej: TaskReject<R, T>, acc: TaskAccept<A, T>): T {
		return this.fn(rej, acc);
	}
}
