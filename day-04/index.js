import {readFile} from 'node:fs/promises';

const testInput = 
`2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

const prodInput = await readFile('./input.txt', 'utf-8');

console.log(prodInput);

const inputToElfPair = x => x.split(/\n/m).filter(x => x !== '');
const elfPairToIndividualElf = x => x.split(/,/);

const getStartAndFinishSections = x => x.map(y => y.split(/-/));

const createFullRange = (toAdd, finish, data) =>
	+toAdd <= +finish 
		? createFullRange(+toAdd+1, +finish, [...data,+toAdd])
		: data;

const getFullRangeForPair = pair => pair.map(x => createFullRange(x[0], x[1], []));

const fullyContainedFilter = pair => 
	pair[0].every(x => pair[1].includes(x))
	|| pair[1].every(x => pair[0].includes(x)); 

const dataToFullRanges = inputToElfPair(prodInput)
	.map(elfPairToIndividualElf)
	.map(getStartAndFinishSections)
	.map(getFullRangeForPair);

const part1 =	dataToFullRanges
	.filter(fullyContainedFilter)
  .length;

const overlapsAtAllFilter = pair => pair[0].some(x => pair[1].includes(x));

const part2 = dataToFullRanges
	.filter(overlapsAtAllFilter)
	.length;

console.log({part1, part2});

