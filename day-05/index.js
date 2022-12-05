import {readFile} from 'node:fs/promises';

const input = await readFile('./input.txt', 'utf8');
const inputLines = input.split(/\n/m).filter(x => x.length > 0);
const parseInputLine = line => line.match(/\d+/g).map(Number);

const crateStacksTopToBottom = [
	[],
	['D', 'H', 'R', 'Z', 'S', 'P', 'W', 'Q'],
	['F', 'H', 'Q', 'W', 'R', 'B', 'V'],
	['H', 'S', 'V', 'C'],
	['G', 'F', 'H'],
	['Z', 'B', 'J', 'G', 'P'],
	['L', 'F', 'W', 'H', 'J', 'T', 'Q'],
	['N', 'J', 'V', 'L', 'D', 'W', 'T', 'Z'],
	['F', 'H', 'G', 'J', 'C', 'Z', 'T', 'D'],
	['H', 'B', 'M', 'V', 'P', 'W']
];

const reverse = arr => [...arr].reverse();
const getLast = arr => arr.length > 0 ? arr[arr.length-1] : '';
const crateStacksBottomToTop = crateStacksTopToBottom.map(reverse);

const crateMover9000Move = (times, from, to) => data => {
	let newData = [...data].map(x => [...x]);
	let turn = 1;
	while(turn <= times) {
		let removed = newData[from].pop();
		newData[to] = newData[to].concat(removed);
		turn++;
	}
	return newData;
};

const crateMover9001Move = (times, from, to) => data => {
	let newData = [...data].map(x => [...x]);
	let turn = 1;
	const toAdd = [];
	while(turn <= times) {
	  toAdd.unshift(newData[from].pop());
		turn++;
	}
	newData[to] = newData[to].concat(toAdd);
	return newData;
};

const part1 = inputLines
	.map(parseInputLine)
	.reduce((acc, [times, from, to]) => crateMover9000Move(times, from, to)(acc), crateStacksBottomToTop)
	.map(getLast)
	.reduce((acc,curr)=> `${acc}${curr}`, '');

const part2 = inputLines
	.map(parseInputLine)
	.reduce((acc, [times, from, to]) => crateMover9001Move(times, from, to)(acc), crateStacksBottomToTop)
	.map(getLast)
	.reduce((acc,curr)=> `${acc}${curr}`, '');

console.log({part1, part2})
