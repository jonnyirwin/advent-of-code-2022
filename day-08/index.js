import { readFile } from "node:fs/promises";

const input = await readFile("./input.txt", "utf8");

const inputToRows = input => input.split(/\n/mg).filter(x => x.length > 0);
const rowsToGrid = rows => rows.map(x => x.split('').map(x => +x));
const getColumn = index => grid => grid.map(col => col[index]);
const reverse = arr => arr.reduce((acc,curr)=> [curr,...acc], []); 

const getTreesBefore = (index, arr, dir) => {
	if(index > 0){
		const result = arr.slice(0, index);
		return reverse(result);
	} 
	else { 
		return [] 
	}
};
const treesToLeft = grid => ([x,y]) => getTreesBefore(x, grid[y], "left");
const treesToRight = grid => ([x,y]) => getTreesBefore(grid[y].length - (x+1), reverse(grid[y]), "right");
const treesToTop = grid => ([x,y]) => getTreesBefore(y, getColumn(x)(grid), "top");
const treesToBottom = grid => ([x,y]) => getTreesBefore(getColumn(x)(grid).length - (y+1), reverse(getColumn(x)(grid)), "bottom");

const isVisible = (treeHeight, ...treeArrays) => treeArrays.some(x => treeHeight > Math.max(...x)); 
const getViewingDistance = (treeHeight, arr, dir) => {
	let index = 0;
	const visible = [];
	let blocked = false;
	while (!blocked && (arr.length > 0 && index < arr.length)) {
		visible.push(arr[index]);
		if(arr[index] >= treeHeight) {
			blocked = true;
		}
		index++;
	}
	return visible.length;
}

const grid = [input]
	.map(inputToRows)
	.map(rowsToGrid)[0];

const treesToLeftWithGrid = treesToLeft(grid);
const treesToRightWithGrid = treesToRight(grid);
const treesToTopWithGrid = treesToTop(grid);
const treesToBottomWithGrid = treesToBottom(grid);

const visibleTrees = [];
const scores = [];

for (let x = 0; x < grid[0].length; x++) {
for (let y = 0; y < grid.length; y++) {
		const left = treesToLeftWithGrid([x,y]);
		const _top = treesToTopWithGrid([x,y]);
		const bottom = treesToBottomWithGrid([x,y]);
		const right = treesToRightWithGrid([x,y]);
		const height = grid[y][x];

		if(isVisible(height,
			left,
			_top,
			bottom,
			right
		)){
			visibleTrees.push([x,y]);
		}

		const leftViewDistance = getViewingDistance(height, left, "left");
		const rightViewDistance = getViewingDistance(height, right, "right");
		const topViewDistance = getViewingDistance(height, _top, "top");
		const bottomViewDistance = getViewingDistance(height, bottom, "bottom");
		const score = leftViewDistance * rightViewDistance * topViewDistance * bottomViewDistance; 
		scores.push(score);
	}
}

const part1 = visibleTrees.length;
const part2 = Math.max(...scores);

console.log({part1, part2});
