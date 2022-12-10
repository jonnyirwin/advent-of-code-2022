import {readFile} from 'node:fs/promises';

let X = 1;
let cycle = 1;
let maxCycle = 1;

const funcs = {
	noop: () => val => val,
	addx: incrementBy => val => val + incrementBy
};

const prodInput = await readFile('./input.txt', 'utf8');

const testInput1 = `noop
addx 3
addx -5`;

const testInput2 = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

const processInput = input => input
	.split(/\n/mg)
	.filter(x => x.length > 0)
	.map(x => x.split(/\s/g))
	.map(([fn, ...args], index) => {
		const cycleToExecute = fn === 'addx' ? maxCycle + 2 : maxCycle + 1;
		maxCycle = cycleToExecute;
		return({fn, args: args.map(Number), cycleToExecute });
	});

const processedInput = processInput(prodInput);
const maxCycles = 240;//Math.max(...processedInput.map(x => x.cycleToExecute));
const getFunctionsToExecute = (processedInput, cycle) => processedInput.filter(x => x.cycleToExecute === cycle);
const pipe = (...fns) => x0 => fns.reduce((x,f) => f(x), x0);

let results = {}
while(cycle <= maxCycles) {
	const fnsToExecute = getFunctionsToExecute(processedInput, cycle);
	const fns = fnsToExecute.map(x => funcs[x.fn].apply(null, x.args));
	X = pipe.apply(null, fns)(X); 
	results[cycle] = X;
	cycle++;
}

const getPixels = rowResults => rowResults.map((cycle, index) => {
	const x = results[cycle]
  const pixel = index >= x - 1 && index <= x + 1 ? "#" : '.';
	console.log(`Cycle ${cycle}: Draws ${pixel} in position ${+cycle - 1}`);		
	return pixel;
});

const part1 =
	results[20] * 20 
	+ results[60] * 60
	+ results[100] * 100
	+ results[140] * 140
	+ results[180] * 180
	+ results[220] * 220;

const rows = [1,2,3,4,5,6].map(x => Object.keys(results).slice((x-1)*40,x*40));
console.log(rows.length, rows)

const part2 = 
	rows
		.map(getPixels)
		.map(x =>x.reduce((acc, curr)=> `${acc}${curr}`, ``))
		.reduce((acc,curr)=>`${acc}\n${curr}`, '');

console.log({part1});
console.log(part2);
