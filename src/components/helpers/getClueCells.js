export default function getClueCells(clue, cells) {
  let clueCells = Array(cells.length);
  cells.forEach((cell, cellIndex) => {
    if ([
      cell.clues.across?.clueId,
      cell.clues.down?.clueId
    ].includes(clue)) {
      clueCells[cellIndex] = cell;
    }
  })
  return clueCells;
}
