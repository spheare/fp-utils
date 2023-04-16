import { maybe } from './maybe';

const testApplicativeMaybe = () => {
	const testap = maybe((x: string) => (y: number) => `${x}${y}`);
	console.log(
		testap
			.ap(maybe(3))
			.ap(maybe('zozo'))
			.fold<string>('13', r => '' + r)
	);
};

const testtask = () => {
	const missiles = (reject, res) => {
		res('missiles');
	};
	const t = Task.of(1);
	t.map(x => x + '!!').fn(
		e => console.error('shiii', e),
		a => console.log(a)
	);
};

const execute = f => f.apply(this);

[testApplicativeMaybe, testtask].forEach(execute);
