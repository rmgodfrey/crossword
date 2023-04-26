// addCells

function addCells(clueIndex, clue, gridWidth, gridHeight, cells) {
  cells = cells.slice();
  for (const [fragmentIndex, fragment] of clue.fragments.entries()) {
    const answer = fragment.answer.replaceAll(/[- ]/g, '');
    const answerLength = answer.length;
    const offsetMultiplier = clue.direction === 'down' ? gridWidth : 1;
    for (let offset = 0; offset < answerLength; offset++) {
      const cellNumber = fragment.start + (offset * offsetMultiplier);
      if (cellNumber >= gridWidth * gridHeight) {
        throw new RangeError('Cell out of bounds.');
      }
      if (!cells[cellNumber]) {
        cells[cellNumber] = {
          clues: {},
          clueNumber: null,
          answer: answer[offset],
        }
      }
      const direction = clue.direction;
      cells[cellNumber].clues[direction] = {
        clueId: clueIndex,
        clueFragment: fragmentIndex,
      };
    }
  }
  return cells;
}

// addClueNumbers

function addClueNumbers(gridWidth, cells) {
  cells = cells.slice();
  let clueNumber = 1;
  for (const cellIndex in cells) {
    if (isStartOfCellSequence(cellIndex, gridWidth, cells)) {
      cells[cellIndex].clueNumber = clueNumber++;
    }
  }
  return cells;
}

function isStartOfCellSequence(cellIndex, gridWidth, cells) {
  return (
    isStartOfHorizontalCellSequence(cellIndex, gridWidth, cells)
    || isStartOfVerticalCellSequence(cellIndex, gridWidth, cells)
  );
}

function isStartOfHorizontalCellSequence(cellIndex, gridWidth, cells) {
  cellIndex = Number(cellIndex);
  return (
    (cellIndex % gridWidth === 0 || !(cellIndex - 1 in cells))
    && cellIndex % gridWidth !== gridWidth - 1
    && cellIndex + 1 in cells
  );
}

function isStartOfVerticalCellSequence(cellIndex, gridWidth, cells) {
  cellIndex = Number(cellIndex);
  return (
    !(cellIndex - gridWidth in cells)
    && cellIndex + gridWidth in cells
  );
}

// createCells

export default function createCells(clues, gridWidth, gridHeight) {
  let cells = Array(gridWidth * gridHeight);
  for (const [clueIndex, clue] of clues.entries()) {
    cells = addCells(
      clueIndex,
      clue,
      gridWidth,
      gridHeight,
      cells
    );
  }
  cells = addClueNumbers(gridWidth, cells);
  return cells;
}
