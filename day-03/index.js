import {readFile} from 'node:fs/promises';

const input = await readFile('./input.txt', 'utf-8');

const rucksacks = input.split(/\n/m);
const containers = rucksacks.map(x => [x.slice(0, x.length/2), x.slice(x.length/2)]);
const appearsInBoth = containers.reduce((acc, curr)=> {
	const [containerA, containerB] = curr;
	const inBoth = [...new Set(containerA.split(''))].filter(x => [...new Set(containerB.split(''))].includes(x));
	return [...acc,...inBoth];
}, []);

const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
const part1 = appearsInBoth.reduce((acc,curr)=> acc + letters.indexOf(curr)+1, 0);

const elfGroups = rucksacks.reduce((acc, curr, index)=> {
	const needsNewItem = index !== 0 && index % 3 === 0;
	if(needsNewItem){
		acc.push([curr]);
	} else {
		acc[acc.length-1].push(curr);
	}
	return acc;
}, [[]]);

const commonLetters = elfGroups.map(x => {
	const [a,b,c] = x;
	const getUnique = z => [...new Set(z.split(''))];
	return getUnique(a).find(y => getUnique(b).find(w => w === y) && getUnique(c).find(m => m === y)); 
});

const part2 = commonLetters.reduce((acc,curr) => {
	return acc + letters.indexOf(curr)+1;
},0);

console.log({part1, part2});
