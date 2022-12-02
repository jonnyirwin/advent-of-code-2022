import { readFile } from "node:fs/promises";
const input = await readFile(`input.txt`, "utf-8");

const games = input.split(/\n/gm).map((x) => x.split(" "));

const opponent = {
  A: "Rock",
  B: "Paper",
  C: "Scissors",
};

const you = {
  X: { pick: "Rock", score: 1 },
  Y: { pick: "Paper", score: 2 },
  Z: { pick: "Scissors", score: 3 },
};

const getPicksFromLetters = (letters) => [
  opponent[letters[0]],
  you[letters[1]],
];

const draw = (x) => {
  const [opponentPick, yourPick] = getPicksFromLetters(x);
  return opponentPick === yourPick.pick;
};

const win = (x) => {
  const [opponentPick, yourPick] = getPicksFromLetters(x);
  return (
    (yourPick.pick === "Rock" && opponentPick === "Scissors") ||
    (yourPick.pick === "Paper" && opponentPick === "Rock") ||
    (yourPick.pick === "Scissors" && opponentPick === "Paper")
  );
};

const lose = (x) => {
  const [opponentPick, yourPick] = getPicksFromLetters(x);
  return (
    (yourPick.pick === "Rock" && opponentPick === "Paper") ||
    (yourPick.pick === "Paper" && opponentPick === "Scissors") ||
    (yourPick.pick === "Scissors" && opponentPick === "Rock")
  );
};

const getScores = (gamesInput) => {
  const drawScores = gamesInput
    .filter(draw)
    .map((x) => x[1])
    .map((x) => you[x].score)
    .reduce((acc, cur) => acc + cur + 3, 0);
  const winScores = gamesInput
    .filter(win)
    .map((x) => x[1])
    .map((x) => you[x].score)
    .reduce((acc, cur) => acc + cur + 6, 0);
  const loseScores = gamesInput
    .filter(lose)
    .map((x) => x[1])
    .map((x) => you[x].score)
    .reduce((acc, cur) => acc + cur, 0);

  return drawScores + winScores + loseScores;
};

const part2Draws = games.filter(x => x[1] === 'Y');
const part2Losses = games.filter(x => x[1] === 'X');
const part2Wins = games.filter(x => x[1] === 'Z');

const getDrawShape = gameInput => {
    const [opponentPick] = getPicksFromLetters(gameInput);
    return opponentPick;
};

const getWinShape = gameInput => { 
    const [opponentPick] = getPicksFromLetters(gameInput);
    return opponentPick === 'Rock' ? 'Paper' : opponentPick === 'Paper' ? 'Scissors' : 'Rock';
};

const getLoseShape = gameInput => {
    const [opponentPick] = getPicksFromLetters(gameInput);
    return opponentPick === 'Rock' ? 'Scissors' : opponentPick === 'Paper' ? 'Rock' : 'Paper';
};

const part2DrawnScores = part2Draws.map(getDrawShape).map(x => x === 'Rock' ? 1 : x === 'Paper' ? 2 : 3).reduce((acc, cur) => acc + cur + 3, 0);
const part2WinScores = part2Wins.map(getWinShape).map(x => x === 'Rock' ? 1 : x === 'Paper' ? 2 : 3).reduce((acc, cur) => acc + cur + 6, 0);
const part2LoseScores = part2Losses.map(getLoseShape).map(x => x === 'Rock' ? 1 : x === 'Paper' ? 2 : 3).reduce((acc, cur) => acc + cur, 0);
const part2Total = part2DrawnScores + part2WinScores + part2LoseScores;

console.log({ part1: getScores(games), part2: part2Total });
