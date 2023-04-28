import focusAndSelectCell from '../focusAndSelectCell';

function getClueIds(cellNumber, cells) {
  return Object.values(cells[cellNumber].clues).map(
    clue => clue.clueId
  );
}

function isBeginningOfWord(
  cellNumber,
  cells,
  clues,
  direction,
) {
  const cellClues = cells[cellNumber].clues;
  if (!(direction in cellClues)) {
    return false;
  }
  const clueId = cellClues[direction].clueId;
  const fragments = clues[clueId].fragments;
  return fragments.some(fragment => fragment.start === cellNumber);
}

function retrieveClue(
  cellNumber,
  hint,           // hint should be 'down', 'across', or null
  {
    cells,
    clues,
    state: {
      cellState: [selectedCell],
      clueState: [selectedClue],
    },
  },
) {
  // Find out which clues the chosen cell belongs to.
  const clueIds = getClueIds(cellNumber, cells);

  // If the chosen cell belongs to the currently selected clue, return that
  // clue, unless the chosen cell is the currently selected cell.
  if (clueIds.includes(selectedClue) && cellNumber !== selectedCell) {
    return selectedClue;
  }

  // Give priority to the hinted direction. If no hinted direction, give
  // priority to 'across'.
  const directionList = (
    hint === 'down' ? ['down', 'across'] : ['across', 'down']
  );

  // Find the directions of the clues that the chosen cell belongs to.
  const possibleDirections = directionList.filter((direction) => {
    return Object.keys(cells[cellNumber].clues).includes(direction);
  });

  // If the chosen cell is the currently selected cell, return the other clue
  // that the chosen cell belongs to. If the chosen cell only belongs to one
  // clue, return that clue.
  if (cellNumber === selectedCell) {
    const selectedDirection = possibleDirections.findIndex(
      direction => direction === clues[selectedClue].direction
    );
    const nextDirection = possibleDirections[
      (selectedDirection + 1) % possibleDirections.length
    ];
    return cells[cellNumber].clues[nextDirection].clueId;
  }

  // If no directional hint was provided, we prioritize beginnings of clue
  // fragments. If the chosen cell is the first cell of a clue fragment, return
  // the clue that the clue fragment belongs to. If the chosen cell is the first
  // cell of multiple clue fragments, we prioritize across clues.
  if (!hint) {
    for (const direction of possibleDirections) {
      if (isBeginningOfWord(cellNumber, cells, clues, direction)) {
        return cells[cellNumber].clues[direction].clueId;
      }
    }
  }

  // Return the most prioritized clue of the clues that the chosen cell belongs
  // to (where priority is determined by the directional hint, defaulting to
  // 'across').
  for (const direction of possibleDirections) {
    return cells[cellNumber].clues[direction].clueId;
  }

  // If chosen cell doesn't exist (and hence doesn't belong to a clue), return
  // the already selected clue.
  return selectedClue;
}

export default function handleClick(props, hint) {
  const {
    cellNumber,
    state: {
      cellState: [, selectCell],
      clueState: [, selectClue],
    },
    cellRefs,
  } = props;
  selectClue(retrieveClue(cellNumber, hint, props));
  focusAndSelectCell(cellNumber, selectCell, cellRefs);
}
