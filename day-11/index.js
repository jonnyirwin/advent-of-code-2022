const testInput = `Monkey 0:
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

const prodInput = `Monkey 0:
  Starting items: 59, 74, 65, 86
  Operation: new = old * 19
  Test: divisible by 7
    If true: throw to monkey 6
    If false: throw to monkey 2

Monkey 1:
  Starting items: 62, 84, 72, 91, 68, 78, 51
  Operation: new = old + 1
  Test: divisible by 2
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 78, 84, 96
  Operation: new = old + 8
  Test: divisible by 19
    If true: throw to monkey 6
    If false: throw to monkey 5

Monkey 3:
  Starting items: 97, 86
  Operation: new = old * old
  Test: divisible by 3
    If true: throw to monkey 1
    If false: throw to monkey 0

Monkey 4:
  Starting items: 50
  Operation: new = old + 6
  Test: divisible by 13
    If true: throw to monkey 3
    If false: throw to monkey 1

Monkey 5:
  Starting items: 73, 65, 69, 65, 51
  Operation: new = old * 17
  Test: divisible by 11
    If true: throw to monkey 4
    If false: throw to monkey 7

Monkey 6:
  Starting items: 69, 82, 97, 93, 82, 84, 58, 63
  Operation: new = old + 5
  Test: divisible by 5
    If true: throw to monkey 5
    If false: throw to monkey 7

Monkey 7:
  Starting items: 81, 78, 82, 76, 79, 80
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 3
    If false: throw to monkey 4`;

const init = input => input
	.split(/Monkey \d+:\n/gm)
	.filter(x => x.length > 0)
	.map(x => ({rawInput: x, inspectionCount: 0}));

const getSet = (source, target, fn) => obj => ({...obj, [target]: fn(obj[source])});
const pipe = (...fns) => x0 => fns.reduce((x, f) => f(x), x0);

const extractStartingItems = input => 
	/Starting items: ((?:\d+,?\s?)+)/mg.exec(input)[1]
		.trim()
		.split(/, /g)
		.map(BigInt);

const extractDivisibleBy = input =>
	BigInt(/divisible by (\d+)/mg.exec(input)[1].trim());

const extractTargetWhenTrue = input =>
	+(/If true: throw to monkey (\d+)/mg.exec(input)[1].trim());	

const extractTargetWhenFalse = input =>
	+(/If false: throw to monkey (\d+)/mg.exec(input)[1].trim());	

const extractOperation = input => {
	let operationText = /Operation: new = (.*?)$/mg.exec(input)[1].trim();
	operationText = /\d$/.test(operationText) ? operationText.concat("n") : operationText;
	return operationText;
};

const parseStartingItems = 
	getSet('rawInput', 'startingItems', extractStartingItems);

const parseDivisibleBy =
	getSet('rawInput', 'divisibleBy', extractDivisibleBy);

const parseTargetWhenTrue =
	getSet('rawInput', 'targetWhenTrue', extractTargetWhenTrue);

const parseTargetWhenFalse =
	getSet('rawInput', 'targetWhenFalse', extractTargetWhenFalse);

const parseOperation =
	getSet('rawInput', 'operationText', extractOperation);

// why would I do this, what is wrong with me?
const evalIsEvil = monkey => param => {
	const old = param;
	const result = eval(monkey.operationText);
	return result
};

const parse = pipe(
	parseStartingItems,
	parseDivisibleBy,
	parseTargetWhenTrue,
	parseTargetWhenFalse,
	parseOperation,
);

const parseInput = input => init(input).map(parse);

const runOperation = monkey => startingItems => startingItems.map(evalIsEvil(monkey));
const worryIncreaser = monkey => getSet('startingItems', 'startingItems', runOperation(monkey))(monkey); 

const divideByThree = startingItems => startingItems.map(x => Math.floor(x/3));
const worryDecreaser = getSet('startingItems', 'startingItems', divideByThree);

const exactlyDivisibleBy = divisibleBy => worryLevel => {
	const result = worryLevel % divisibleBy === 0n;
	return result
};
const calcDestination = monkey => startingItems => startingItems
	.map(x => exactlyDivisibleBy(monkey.divisibleBy)(x) 
		? [x, monkey.targetWhenTrue]
		: [x, monkey.targetWhenFalse]);
const destinationCalculator = monkey => getSet('startingItems', 'startingItems', calcDestination(monkey))(monkey);

const processStartingItems = pipe(
	worryIncreaser, 
	// worryDecreaser, // worryDecreaser is not applied for part2!
	destinationCalculator
);

const calculateMoves = monkey => {
	let m = {...monkey};//JSON.parse(JSON.stringify(monkey));
	m = processStartingItems(m); 
	return m;
}

const playRound = parsedInput => {
	const startingItems = parsedInput.map(x => [...x.startingItems]);
	const x0 = parsedInput.reduce((acc, curr, index) => acc.concat({...curr, startingItems: startingItems[index]}),[]);

	const reducer = (allMonkeys, currentMonkey, index) => {
		allMonkeys[index] = calculateMoves(allMonkeys[index]); 
		allMonkeys[index].startingItems
			.forEach(([worryLevel, destinationMonkey]) => {
				allMonkeys[index].inspectionCount++;
				allMonkeys[destinationMonkey].startingItems.push(worryLevel);
			});
		allMonkeys[index].startingItems = [];
		return allMonkeys;
	};
	return parsedInput.reduce(reducer, x0);
}

const allRoundsArray = [...Array(1000)].map(() => playRound);
const playAllRounds = pipe(...allRoundsArray);

const allRoundsResults = playAllRounds(parseInput(testInput));
const numberOfInspections = allRoundsResults.map(x => x.inspectionCount);
console.log([...numberOfInspections.sort((a,b)=> b-a)].slice(0,2).reduce((acc,curr) => acc*curr, 1));
