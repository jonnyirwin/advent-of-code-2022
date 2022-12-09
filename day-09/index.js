import {readFile} from 'node:fs/promises';

const indexToTrack = 9;
//const knots = ['H', 'T'];
const trackingCharacter = 'x';
const knots = ['H', 1, 2, 3, 4, 5, 6, 7, 8, 9];
const emptyEntry = [...Array(knots.length)].map(() => '.');

const input = await readFile('./input.txt', 'utf8');
const testInput = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

const processInput = input => 
		input
	    .split(/\n/mg)
			.filter(x => x.length > 0)
			.map(x => x.split(" "))
			.map(([direction, count]) => [...Array(+count)].map(() => direction))
			.reduce((acc,curr) => [...acc, ...curr], []);

const addBottomRow = grid => [...grid, [...Array(grid[0].length)].map(() => ([...emptyEntry]))]; 
const addTopRow = grid => [[...Array(grid[0].length)].map(() => ([...emptyEntry])), ...grid]; 
const addRightCol = grid => grid.map(x => ([...x,[...emptyEntry]]));
const addLeftCol= grid => grid.map(x => ([[...emptyEntry], ...x]));

const isLeftEdge = ([_, col]) => col === 0;
const isRightEdge = ([_,col], gridWidth) => col === (gridWidth - 1);
const isTopEdge = ([row]) => row === 0;
const isBottomEdge = ([row], gridHeight) => row === (gridHeight - 1);

const getCharLocation = (char, position) => grid => {
	let row = 0;
	let rowFound = false;
	while(!rowFound) {
		rowFound = grid[row].some(x => x[position] === char);
		if(!rowFound) row++;
	}

	let col = 0;
	let colfound = false;
	while(!colfound) {
		colfound = grid[row][col][position] === char;
		if(!colfound) col++;
	}
	return [row, col];
} 
const getHeadLocation = getCharLocation('H', 0);

const setChar = (char, tuplePosition) => ([row,col], grid) => {
	grid[row][col][tuplePosition] = char;
}
const setHead = setChar('H', 0);
const clearHead = setChar('h', 0);

const setTail = setChar('T', 1);
const clearTail = setChar('t', 1);

const isTouching = ([headRow, headCol], [tailRow, tailCol]) => (Math.abs(headRow - tailRow) <= 1) && (Math.abs(headCol - tailCol) <= 1);
const isSameRow = ([headRow], [tailRow]) => headRow === tailRow;
const isSameCol =([headRow, headCol], [tailRow, tailCol]) => headCol === tailCol;

const startPosition = [
	[[...knots]]
];

const moveHead = (grid, direction) => {
	let _grid = grid;
	let headLocation = getHeadLocation(_grid);
	let newHeadLocation = headLocation;
	switch (direction) {
		case 'U':
			if(isTopEdge(headLocation)) {
				_grid = addTopRow(_grid);
				headLocation = getHeadLocation(_grid);
			}
			newHeadLocation = [headLocation[0] - 1, headLocation[1]];
			break;
		case 'D':
			if(isBottomEdge(headLocation, _grid.length)) {
				_grid = addBottomRow(_grid);
				headLocation = getHeadLocation(_grid);
			}
			newHeadLocation = [headLocation[0] + 1, headLocation[1]];
			break;	
		case 'L':
			if(isLeftEdge(headLocation)) {
				_grid = addLeftCol(_grid);
				headLocation = getHeadLocation(_grid);
			}
			newHeadLocation = [headLocation[0], headLocation[1] - 1];
			break;
		case 'R':
			if(isRightEdge(headLocation, _grid[0].length)) {
				_grid = addRightCol(_grid);
				headLocation = getHeadLocation(_grid);
			}
			newHeadLocation = [headLocation[0], headLocation[1] + 1];
			break;
		default:
			break;
	}
	//console.log({newHeadLocation})
	setHead(newHeadLocation, _grid);
	clearHead(headLocation, _grid);
	return _grid;
};				//console.log(_grid)				//console.log(_grid)

const moveKnot = (knots, currentKnotIndex, indexToTrack, trackingMarker, grid) => {
	let _grid =	grid;
	const previousKnotLocation = getCharLocation(knots[currentKnotIndex-1], currentKnotIndex-1)(_grid);
	const [prevRow, prevCol] = previousKnotLocation;
	const currentKnotLocation = getCharLocation(knots[currentKnotIndex], currentKnotIndex)(_grid);
	const [currentRow, currentCol] = currentKnotLocation;
	let newKnotLocation = currentKnotLocation;
	
	if(isTouching(previousKnotLocation, currentKnotLocation)) {
		return _grid;
	}

	if(!isSameCol(previousKnotLocation, currentKnotLocation)) {
		newKnotLocation = prevCol > currentCol
			? [newKnotLocation[0], newKnotLocation[1] + 1] 
			: [newKnotLocation[0], newKnotLocation[1] - 1];		
	}

	if(!isSameRow(previousKnotLocation, currentKnotLocation)) {
		newKnotLocation = prevRow > currentRow
			? [newKnotLocation[0] + 1, newKnotLocation[1]] 
			: [newKnotLocation[0] - 1, newKnotLocation[1]];		
	}
	setChar(knots[currentKnotIndex], currentKnotIndex)(newKnotLocation, _grid);
	setChar(currentKnotIndex === indexToTrack ? trackingMarker : '.', currentKnotIndex)(currentKnotLocation, _grid);
	return _grid;
}

const countChars = (chars, grid) => 
		grid
			.reduce((acc, curr) => [...acc, ...curr], [])
			.reduce((acc, curr) => [...acc, ...curr])
			.filter(x => chars.includes(x))
			.length;

const movements = processInput(input);
let grid = startPosition;


movements.forEach((direction, index) => {
	grid = moveHead(grid, direction);
	knots.forEach((_, index) => {
		if(index === 0) return;
	  	grid = moveKnot(knots, index, indexToTrack, trackingCharacter, grid);	
	});
	//console.log(`${index}. ${direction}`, JSON.stringify(grid));
});

//const part1 = countChars(['t', 'T'], grid);
//console.log('part1', part1);
const part2 = countChars([9, 'x'], grid);
console.log('part2', part2);
