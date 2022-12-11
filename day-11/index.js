const input = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;

const monkeys = input
	.split(/Monkey \d+:\n/gm)
	.filter(x => x.length > 0)
	.map(x => ({rawInput: x}));

const getSet = (source, target, fn) => obj => ({...obj, [target]: fn(obj[source])});
const pipe = (...fns) => x0 => fns.reduce((x, f) => f(x), x0);

const extractStartingItems = input => 
	/Starting items: ((?:\d+,?\s?)+)/mg.exec(input)[1]
		.trim()
		.split(/, /g)
		.map(x => +x);

const extractDivisibleBy = input =>
	+(/divisible by (\d+)/mg.exec(input)[1].trim());

const extractTargetWhenTrue = input =>
	+(/If true: throw to monkey (\d+)/mg.exec(input)[1].trim());	

const extractTargetWhenFalse = input =>
	+(/If false: throw to monkey (\d+)/mg.exec(input)[1].trim());	

const extractOperation = input =>
	/Operation: new = (.*?)$/mg.exec(input)[1].trim();

const parseStartingItems = 
	getSet('rawInput', 'startingItems', extractStartingItems);

const parseDivisibleBy =
	getSet('rawInput', 'divisibleBy', extractDivisibleBy);

const parseTargetWhenTrue =
	getSet('rawInput', 'targetWhenTrue', extractTargetWhenTrue);

const parseTargetWhenFalse =
	getSet('rawInput', 'targetWhenFalse', extractTargetWhenFalse);

const parseOperation =
	getSet('rawInput', 'operation', extractOperation);

const parse = pipe(
	parseStartingItems,
	parseDivisibleBy,
	parseTargetWhenTrue,
	parseTargetWhenFalse,
	parseOperation
);

const parsedInput = monkeys.map(parse);

console.log(parsedInput)
