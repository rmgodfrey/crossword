import Grid from './Grid.js';
import Controls from './Controls.js';
import ClueContainer from './ClueContainer.js';
import { useState, useRef } from 'react';
import { getLength } from './helpers.js';
import clues from './words3.json';

clues.sort((a, b) => {
  if (a.direction === 'across' && b.direction === 'down') return -1;
  if (a.direction === 'down' && b.direction === 'across') return 1;
  return a.fragments[0].start - b.fragments[0].start;
});

const gridWidth = 15;
const gridHeight = gridWidth;

const gridLayout = function() {
  let gridLayout = Array(gridWidth * gridHeight);
  for (const [clueIndex, clue] of clues.entries()) {
    gridLayout = addCellsToGrid(clueIndex, clue, gridLayout);
  }
  gridLayout = fillGridWithClueNumbers(gridLayout);
  return gridLayout;
}();

function isStartOfHorizontalCellSequence(cellIndex, gridLayout) {
  cellIndex = Number(cellIndex);
  return (
    (cellIndex % gridWidth === 0 || !(cellIndex - 1 in gridLayout))
    && cellIndex % gridWidth !== gridWidth - 1
    && cellIndex + 1 in gridLayout
  );
}

function isStartOfVerticalCellSequence(cellIndex, gridLayout) {
  cellIndex = Number(cellIndex);
  return (
    !(cellIndex - gridWidth in gridLayout)
    && cellIndex + gridWidth in gridLayout
  );
}

function isStartOfCellSequence(cellIndex, gridLayout) {
  return (
    isStartOfHorizontalCellSequence(cellIndex, gridLayout)
    || isStartOfVerticalCellSequence(cellIndex, gridLayout)
  );
}

function addCellsToGrid(clueIndex, clue, gridLayout) {
  gridLayout = gridLayout.slice();
  for (const [fragmentIndex, fragment] of clue.fragments.entries()) {
    const answer = fragment.answer.replaceAll(/[- ]/g, '');
    const answerLength = answer.length;
    const offsetMultiplier = clue.direction === 'down' ? gridWidth : 1;
    for (let offset = 0; offset < answerLength; offset++) {
      const cellNumber = fragment.start + (offset * offsetMultiplier);
      if (cellNumber >= gridWidth * gridHeight) {
        throw new RangeError('Cell out of bounds.');
      }
      if (!gridLayout[cellNumber]) {
        gridLayout[cellNumber] = {
          clues: {},
          clueNumber: null,
          answer: answer[offset],
        }
      }
      const direction = clue.direction;
      gridLayout[cellNumber].clues[direction] = {
        clueId: clueIndex,
        clueFragment: fragmentIndex,
      };
    }
  }
  return gridLayout;
}

function fillGridWithClueNumbers(gridLayout) {
  gridLayout = gridLayout.slice();
  let clueNumber = 1;
  for (const cellIndex in gridLayout) {
    if (isStartOfCellSequence(cellIndex, gridLayout)) {
      gridLayout[cellIndex].clueNumber = clueNumber++;
    }
  }
  return gridLayout;
}

function getClueIds(cellNumber) {
  return Object.values(gridLayout[cellNumber].clues).map(
    clue => clue.clueId
  );
}

function beginningOfWord(cellNumber, direction) {
  const cellClues = gridLayout[cellNumber].clues;
  if (!(direction in cellClues)) {
    return false;
  }
  const clueId = cellClues[direction].clueId;
  const fragments = clues[clueId].fragments;
  return fragments.some(fragment => fragment.start === cellNumber);
}

function getCell(currentCell, axis, direction, distance) {
  const [step, axisMagnitude, axisLength] = (
    axis === 'across' ? [1, currentCell % gridWidth, gridWidth]
    : axis === 'down' ? [
      gridWidth,
      Math.floor(currentCell / gridWidth),
      gridHeight,
    ]
    : null
  );
  const [multiplier, boundary] = (
    direction === 'forwards' ? [distance, axisLength - 1]
    : direction === 'backwards' ? [-distance, 0]
    : null
  );
  if (axisMagnitude === boundary) {
    return null;
  }
  const newCell = currentCell + step * multiplier;
  return (newCell in gridLayout) ? newCell : null;
}

function isAlphabetic(key) {
  if (key.length !== 1) return false;
  const charCodeBetween = (char, low, high) => {
    const charCode = char.charCodeAt(0);
    return charCode >= low.charCodeAt(0) && charCode <= high.charCodeAt(0);
  }
  const isLower = charCodeBetween(key, 'a', 'z');
  const isUpper = charCodeBetween(key, 'A', 'Z');
  return isLower || isUpper;
}

function retrieveClue(
  cellNumber,
  selectedCell,
  selectedClue,
  hint,
) {
  // Find out which clues the chosen cell belongs to.
  const clueIds = getClueIds(cellNumber);

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
    return Object.keys(gridLayout[cellNumber].clues).includes(direction);
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
    return gridLayout[cellNumber].clues[nextDirection].clueId;
  }

  // If no directional hint was provided, we prioritize beginnings of clue
  // fragments. If the chosen cell is the first cell of a clue fragment, return
  // the clue that the clue fragment belongs to. If the chosen cell is the first
  // cell of multiple clue fragments, we prioritize across clues.
  if (!hint) {
    for (const direction of possibleDirections) {
      if (beginningOfWord(cellNumber, direction)) {
        return gridLayout[cellNumber].clues[direction].clueId;
      }
    }
  }

  // Return the most prioritized clue of the clues that the chosen cell belongs
  // to (where priority is determined by the directional hint, defaulting to
  // 'across'.)
  for (const direction of possibleDirections) {
    return gridLayout[cellNumber].clues[direction].clueId;
  }
  return selectedClue;
}

function getClueFragments() {
  const clueFragments = [];
  clues.forEach((clue, index) => {
    clue.fragments.forEach((fragment) => {
      clueFragments.push({ ...fragment, clueId: index });
    });
  });
  return clueFragments;
}

function createClues(clueFragments) {
  clueFragments = clueFragments.slice().sort((a, b) => a.start - b.start);
  let clueNumber = 1;
  const encounteredClues = [];
  clueFragments.forEach((clueFragment) => {
    if (
      encounteredClues.length
      && clueFragment.start > encounteredClues.at(-1).start
    ) {
      clueNumber++;
    }
    let clueText = clues[clueFragment.clueId].text;
    const firstFragmentFromSameWord = encounteredClues.find(
      clue => clue.clueId === clueFragment.clueId
    );
    if (firstFragmentFromSameWord) {
      firstFragmentFromSameWord.clueNumbers.push(clueNumber);
      const firstClueNumber = firstFragmentFromSameWord.clueNumbers[0];
      clueText = `See ${firstClueNumber}`;
    }
    encounteredClues.push({
      direction: clues[clueFragment.clueId].direction,
      start: clueFragment.start,
      clueId: clueFragment.clueId,
      clueNumbers: [clueNumber],
      clueText,
    })
  });
  return partition(encounteredClues, clue => clue.direction === 'across');
}

function partition(iterable, testFn) {
  const result = [[], []];
  for (const item of iterable) {
    if (testFn(item)) {
      result[0].push(item);
    } else {
      result[1].push(item);
    }
  }
  return result;
}


export default function Crossword() {
  const [selectedCell, selectCell] = useState(null);
  const [selectedClue, selectClue] = useState(null);
  const [cellText, changeCellText] = useState(new Map());
  const cellRefs = useRef([]);

  function handleControls(instruction, target) {
    let cells = gridLayout;
    if (target === 'letter') {
      if (selectedCell === null) return;
      cells = Array(gridLayout.length);
      cells[selectedCell] = gridLayout[selectedCell];
    }
    const newCellText = new Map(cellText);
    cells.forEach((cell, index) => {
      if (instruction === 'check') {
        if (cellText.get(index)?.toUpperCase() !== cell.answer.toUpperCase()) {
          newCellText.delete(index);
        }
      } else if (instruction === 'reveal') {
        newCellText.set(index, cell.answer.toUpperCase());
      }
    });
    changeCellText(newCellText);
    focusAndSelectCell(selectedCell);
  }

  function focusAndSelectCell(cellNumber) {
    cellRefs.current[cellNumber].focus();
    selectCell(cellNumber);
  }

  function handleCursorKey(key) {
    const cursorDict = new Map([
      ['ArrowLeft', ['across', 'backwards']],
      ['ArrowRight', ['across', 'forwards']],
      ['ArrowUp', ['down', 'backwards']],
      ['ArrowDown', ['down', 'forwards']]
    ]);
    const newCell = getCell(
      selectedCell,
      ...cursorDict.get(key),
      1,
    );
    newCell === null || handleCellClick(newCell, cursorDict.get(key)[0]);
  }

  function handleCellClick(cellNumber, hint = null) {
    selectClue(retrieveClue(
      cellNumber,
      selectedCell,
      selectedClue,
      hint,
    ));
    focusAndSelectCell(cellNumber, hint);
  }

  function handleAlphabeticKey(key) {
    changeCellText(new Map(cellText).set(selectedCell, key));
    advanceCell('forwards');
  }

  function advanceCell(direction) {
    const offset = direction === 'backwards' ? -1 : 1;
    const axis = clues[selectedClue].direction;
    const fragment = gridLayout[selectedCell].clues[axis].clueFragment;
    const nextCell = getCell(
      selectedCell,
      axis,
      direction,
      1,
    );
    if (nextCell === null) {
      const nextFragment = clues[selectedClue].fragments[fragment + offset];
      if (nextFragment === undefined) return;
      const fragmentEnd = getCell(
        nextFragment.start,
        axis,
        'forwards',
        direction === 'backwards' ? getLength(nextFragment.answer) - 1 : 0,
      );
      focusAndSelectCell(fragmentEnd);
    } else {
      focusAndSelectCell(nextCell);
    }
  }

  function handleKeyDown(event) {
    if ([
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown'
    ].includes(event.key)) {
      event.preventDefault();
      return handleCursorKey(event.key);
    }
    if (isAlphabetic(event.key)) {
      if (event.ctrlKey || event.altKey || event.metaKey) return;
      return handleAlphabeticKey(event.key.toUpperCase());
    }
    if (['Backspace', 'Delete'].includes(event.key)) {
      return handleDeleteKey();
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      const direction = event.shiftKey ? 'backwards' : 'forwards';
      return handleTabKey(direction);
    }
  }

  function handleTabKey(direction) {
    const multiplier = direction === 'backwards' ? -1 : 1;
    let nextClue = selectedClue + 1 * multiplier;
    if (nextClue === clues.length) nextClue = 0;
    if (nextClue === -1) nextClue = clues.length - 1;
    selectClue(nextClue);
    focusAndSelectCell(clues[nextClue].fragments[0].start);
  }

  function handleDeleteKey() {
    const cellTextLocal = new Map(cellText);
    if (cellTextLocal.delete(selectedCell)) {
      changeCellText(cellTextLocal);
    } else {
      advanceCell('backwards');
    }
  }

  function handleClueClick(fragment) {
    selectClue(fragment.clueId);
    focusAndSelectCell(fragment.start);
  }

  const [acrossClues, downClues] = createClues(getClueFragments());

  return (
    <>
      <h1>Crossword</h1>
      <div className="crossword-container">
        <div className="grid-and-controls">
          <Grid {...{
            gridLayout,
            handleCellClick,
            handleKeyDown,
            gridWidth,
            gridHeight,
            selectedCell,
            selectedClue,
            cellText,
            cellRefs,
          }} />
          <Controls onClick={handleControls}/>
        </div>
        <ClueContainer {...{
          clues: acrossClues,
          selectedClue,
          handleClueClick,
          headingLevel: 'h2',
        }}>
          Across
        </ClueContainer>
        <ClueContainer {...{
          clues: downClues,
          selectedClue,
          handleClueClick,
          headingLevel: 'h2',
        }}>
          Down
        </ClueContainer>
      </div>
    </>
  )
}
