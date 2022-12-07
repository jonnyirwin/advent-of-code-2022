import {readFile} from 'node:fs/promises';

const input = await readFile('./input.txt', 'utf8');
const inputLines = input.split('\n').filter(x => x.length > 0);

const changeDirectory = (command, currentPath) => {
	const dir = command.split(/\s/)[2].trim();
	return dir === '..' 
		? currentPath.slice(0, currentPath.length - 1) 
		: dir === '/' 
			? [] 
			: currentPath.concat(dir); 
};

const isChangeDirectory = line => line.startsWith('$ cd');
const isDir = line => line.startsWith('dir');
const isFile = line => /^\d/.test(line);

const getObject = (path, directoryStructure) => {
	let obj = directoryStructure;
	for(let p of path) {
		obj = obj[p];
	}
	return obj;
};


const processLines = (remainingLines, currentPath, currentDirectoryStructure) => {
	let path = [...currentPath];	
	if(remainingLines.length > 0) {
		const currentLine = remainingLines[0];

		if(isChangeDirectory(currentLine)) {
			path = changeDirectory(currentLine, path);
		}

		if(isDir(currentLine)) {
			const dir = currentLine.split(/\s/)[1].trim();
			const objAtPath = getObject(path, currentDirectoryStructure);
			objAtPath[dir] = {};
		}

		if(isFile(currentLine)) {
			const [fileSize, fileName] = currentLine.split(/\s/);
			const objAtPath = getObject(path, currentDirectoryStructure);
			objAtPath[fileName] = +fileSize;
		}

		return processLines(remainingLines.slice(1), path, currentDirectoryStructure);
	} else {
		return currentDirectoryStructure;
	};
}

const getDirectorySize = directory => Object.keys(directory).reduce((acc, curr) => {
	return !isNaN(directory[curr]) ? acc+directory[curr] : acc + getDirectorySize(directory[curr])
}, 0);

const getAllDirectorySizes = (currentDirectory, directory, results) => Object.keys(directory).reduce((acc, curr)=>{
	return !isNaN(directory[curr]) ? acc : getAllDirectorySizes(`${currentDirectory}-${curr}`, directory[curr], {...acc, [`${currentDirectory}-${curr}`]: getDirectorySize(directory[curr])})
}, results);

const directoryStructure = processLines(inputLines, [], {});

const sumOfSizeOfDirsLessThan = (maxValue, directory) => {
	const directorySizes = getAllDirectorySizes('/', directory, {});
	return Object.keys(directorySizes)
		.filter(x => directorySizes[x] <= maxValue)
		. map(x => directorySizes[x])
		.reduce((acc,curr)=>acc+curr, 0);

}	 
		
const dirsMoreThan = (directory, minValue) => {
	const directorySizes = getAllDirectorySizes('/', directory, {});
	return Object.keys(directorySizes)
		.filter(x => directorySizes[x] >= minValue)
		. map(x => ({dir: x, size: directorySizes[x]}))
}	 

const part1 = sumOfSizeOfDirsLessThan(100000, directoryStructure);

const spaceLeft = 70000000 - getDirectorySize(directoryStructure);
const spaceNeeded = 30000000 - spaceLeft;
const dirsTheRightSize = dirsMoreThan(directoryStructure, spaceNeeded);
const part2 = Math.min(...dirsTheRightSize.map(x => x.size));

console.log({part1, part2});
