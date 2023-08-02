import { useState } from 'react';
import Heading from './Heading';
import Grid from './Grid';
import './styles/Crossword.css';

const arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
const deleteKeys = ['Backspace', 'Delete'];
const tabKeys = ['Tab'];

export default function Crossword({
  cells,
  clues,
  gridWidth,
  gridHeight = gridWidth,
  headingLevel,
  helpers: {
    step,
    generateCellsFromClue,
    generateCellsFromFragment,
  }
}) {
  const [selectedClue, setSelectedClue] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [cellTextMap, setCellTextMap] = useState(new Map());
  const handledKeys = [...arrowKeys, ...deleteKeys, ...tabKeys];
  const clueFragments = clues
    .flatMap(clue => (
      clue.fragments.map(fragment => ([clue.orientation, fragment]))
    ))
    .sort(comparePriority(([orientation, ]) => orientation === 'across'))
    .map(([, fragment]) => fragment)
    .sort((a, b) => a.start - b.start);

  function dimensionLengthInCells(orientation) {
    switch (orientation) {
      case 'across': return gridWidth;
      case 'down': return gridHeight;
      default: throw new Error('`orientation` must be either "across" or "down"');
    }
  }

  function getExtremeCell(orientation, edge) {
    const dimensionLength = dimensionLengthInCells(orientation);
    switch (edge) {
      case 'start': return 0;
      case 'end': return dimensionLength - 1;
      default: throw new Error('`edge` must be either "start" or "end"');
    }
  }

  function getColumn(cell) {
    return cell % gridWidth;
  }

  function getRow(cell) {
    return Math.floor(cell / gridWidth);
  }

  function getRowOrColumn(cell, orientation) {
    switch (orientation) {
      case 'across': return getColumn(cell);
      case 'down': return getRow(cell);
      default: return undefined;
    }
  }

  /* TODO: Fix the case where I start on the last cell of 25-down and then hit
  the right arrow. Should select 28-across but selects 30-down. See also the
  case where I start on the last cell of 10-across and then hit down arrow. */

  function getCell(originalCell, orientation, direction, magnitude) {
    const transform = {
      forwards: n => n,
      backwards: n => -n
    }[direction];

    let nextCell = originalCell + transform(step(magnitude, orientation));
    const otherOrientation = (
      orientation === 'across' ? 'down'
      : orientation === 'down' ? 'across'
      : undefined
    );
    if (!cells.includes(nextCell) || (
      getRowOrColumn(originalCell, otherOrientation)
      !== getRowOrColumn(nextCell, otherOrientation)
    )) {
      nextCell = null;
    }
    return nextCell;
  }

  function containsCell(clue, cell) {
    for (const currentCell of generateCellsFromClue(clue)) {
      if (currentCell === cell) return true;
    }
    return false;
  }

  // Returns an array of clues to which `cell` belongs. If `cell` belongs to
  // both an across and a down clue, the across clue comes first in the returned
  // array.
  function getCellClues(cell, preferredOrientation = 'across') {
    return clues
      .filter(clue => containsCell(clue, cell))
      .sort(comparePriority(clue => clue.orientation === preferredOrientation));
  }

  function comparePriority(testFn) {
    return (a, b) => {
      if (testFn(a) && !testFn(b)) return -1;
      if (!testFn(a) && testFn(b)) return 1;
      return 0;
    };
  }

  function beginsClueFragment(cell, clue) {
    for (const fragment of clue.fragments) {
      if (fragment.start === cell) return true;
    }
    return false;
  }

  function handleCellClick(cell, preferredOrientation = 'across') {
    setSelectedCell(cell);
    const cellClues = getCellClues(cell, preferredOrientation);
    const i = cellClues.findIndex(clue => clue === selectedClue);
    if (i >= 0) {
      // If clicked cell is same as currently selected cell, orientation of the
      // selected clue changes (i.e., if across clue is currently selected,
      // down clue gets selected).
      if (cell === selectedCell) {
        setSelectedClue(cellClues[(i + 1) % cellClues.length]);
      } else {
        // If clicked cell belongs to currently selected clue, but clicked cell
        // is *not* the same as the currently selected cell, then the
        // orientation of the selected clue does *not* change.
        setSelectedClue(cellClues[i]);
      }
    } else {
      const j = cellClues.findIndex(
        clue => beginsClueFragment(cell, clue)
      );
      if (j >= 0) {
        // If clicked cell is at the start of a clue fragment, then the clue
        // to which that fragment belongs is selected. If clicked cell is at the
        // start of *two* clue fragments, then the clue with preferred
        // orientation is selected.
        setSelectedClue(cellClues[j]);
      } else {
        // If clicked cell belongs to two clues, then the clue with preferred
        // orientation is selected. Otherwise, the sole clue to which the cell
        // belongs is selected.
        setSelectedClue(cellClues[0]);
      }
    }
  }


  function handleArrowKey(key) {
    const cursorDict = new Map([
      ['ArrowLeft', ['across', 'backwards']],
      ['ArrowRight', ['across', 'forwards']],
      ['ArrowUp', ['down', 'backwards']],
      ['ArrowDown', ['down', 'forwards']],
    ]);
    const [orientation, direction] = cursorDict.get(key);
    const nextCell = getCell(
      selectedCell,
      orientation,
      direction,
      1,
    );
    nextCell === null || handleCellClick(nextCell, orientation);
  }

  function getCurrentFragment() {
    for (const fragment of selectedClue.fragments) {
      for (const cell of generateCellsFromFragment(
        fragment, selectedClue.orientation
      )) {
        if (cell === selectedCell) return fragment;
      }
    }
  }

  function getAdjacentFragment(direction) {
    const currentFragment = getCurrentFragment()
    const i = clueFragments.find(currentFragment);
    const n = {
      'forwards': 1,
      'backwards': -1,
    }[direction];
    return clueFragments[(i + n) % clueFragments.length];
  }

  function getClueFromFragment(fragment) {
    for (const clue of clues) {
      if (clue.fragments.includes(fragment)) return clue;
    }
  }

  function handleTabKey(direction) {
    const nextFragment = getAdjacentFragment(direction);
    const orientation = getClueFromFragment(nextFragment).orientation;
    handleCellClick(nextFragment.start, orientation);
  }

  function handleTextInput() {}

  function handleKeyDown(key, shiftIsPressed) {
    if (arrowKeys.includes(key)) {
      return handleArrowKey(key);
    }
    if (deleteKeys.includes(key)) {
      return handleTextInput(key, 'backwards');
    }
    if (tabKeys.includes(key)) {
      const direction = shiftIsPressed ? 'backwards' : 'forwards';
      return handleTabKey(direction);
    }
  }

  return (
    <div
      className="Crossword"
      tabIndex="0"
      onKeyDown={(e) => {
        if (handledKeys.includes(e.key)) {
          e.preventDefault();
          handleKeyDown(e.key, e.shiftKey);
        }
      }}
    >
      <Heading
        className="Crossword__heading"
        headingLevel={headingLevel}
      >
        Rossword
      </Heading>
      <div className="Crossword__grid-and-controls">
        {/*currentClue*/}
        <Grid
          clues={clues}
          gridWidth={gridWidth}
          gridHeight={gridHeight}
          selectedClue={selectedClue}
          selectedCell={selectedCell}
          cellTextMap={cellTextMap}
          onCellClick={handleCellClick}
          cells={cells}
          helpers={{
            containsCell,
            step,
            getRowOrColumn,
            getColumn,
            getRow,
            getExtremeCell,
            dimensionLengthInCells,
          }}
        />
        {/*currentClue*/}
        {/*<Controls />*/}
      </div>
      {/*{['across', 'down'].map(orientation => (
        <ClueContainer
          key={orientation}
          orientation={orientation}
        >
          <ClueList
            clues={clues}
            onClueClick={handleClueClick}
          />
        </ClueContainer>
      ))}*/}
    </div>
  );
}
