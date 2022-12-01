import {readFile} from 'node:fs/promises';
const input = await readFile(`input.txt`, 'utf-8');
const caloriesByElf = input.split(/^$/gm).map(x => x.split(/\n/gm).filter(x => x.length > 0).map(x => +x).reduce((acc, cur) => acc+cur, 0));
const maxCalories = Math.max(...caloriesByElf);
const top3ElfCalories = [...caloriesByElf].sort((a, b) => b - a).slice(0, 3).reduce((acc, cur) => acc+cur, 0);
console.log({maxCalories, top3ElfCalories});
