import getClueCells from './getClueCells';

export default function isClueFinished(clue, cells, cellText) {
  const clueCells = getClueCells(clue, cells);
  let clueIsFinished = true;
  for (let cellNumber of clueCells.keys()) {
    if (clueCells[cellNumber] === undefined) continue;
    if (!cellText.has(cellNumber)) {
      clueIsFinished = false;
      break;
    }
  }
  return clueIsFinished;
}
