import { useRef, useState } from 'react';
import ClueList from './ClueList';
import Controls from './Controls';
import Grid from './Grid';
import Heading from './Heading';
import OverflowFade from './OverflowFade';
import StandaloneClue from './StandaloneClue';
import './styles/Crossword.css';
import {
  StateError,
  bindMethods,
  numberOfLetters,
} from '../helpers/index';

const arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
const deleteKeys = ['Backspace', 'Delete'];
const tabKeys = ['Tab'];
const handledKeys = [...arrowKeys, ...deleteKeys, ...tabKeys];

export default function Crossword({
  crossword,
  headingLevel,
}) {
  const [selectedClueGroup, setSelectedClueGroup] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [cellText, setCellText] = useState(new Map());
  const gridRef = useRef(null);
  const selectedClue = selectedClueGroup?.clueAtCell(selectedCell);
  const {
    cells,
    getCell,
    orientations,
  } = bindMethods(crossword);

  // Creates a new array of cells. If `target` is 'crossword', then all cells of
  // the crossword appear in the new array. If `target` is 'clueGroup', then
  // only cells of the currently selected clue group appear in the new array. If
  // `target` is 'cell', then only the currently selected cell appears in the
  // new array.
  function copyCells(target) {
    const newCells = [];
    if (target === 'cell') {
      if (!selectedCell) throw new StateError(
        'There is no currently selected cell.'
      );
      newCells[selectedCell.number] = selectedCell;
    } else if (target === 'clueGroup') {
      if (!selectedClueGroup) throw new StateError(
        'There is no currently selected clue group.'
      );
      for (const cell of selectedClueGroup.getCells()) {
        newCells[cell.number] = cell;
      }
    } else if (target === 'crossword') {
      cells.forEach(cell => { newCells[cell.number] = cell });
    }
    return newCells;
  }

  const check = (cell, newCellText) => {
    if (cellText.get(cell)?.toUpperCase() !== cell.answer.toUpperCase()) {
      newCellText.delete(cell);
    }
  }

  const reveal = (cell, newCellText) => {
    newCellText.set(cell, cell.answer.toUpperCase());
  };

  const clear = (cell, newCellText) => {
    newCellText.delete(cell);
  };

  function getNewCellText(visibleCells, fn) {
    const newCellText = new Map(cellText);
    visibleCells.forEach(cell => {
      fn(cell, newCellText);
    })
    return newCellText;
  }

  function handleControlClick(instruction, target) {
    try {
      const visibleCells = copyCells(target);
      const newCellText = getNewCellText(
        visibleCells,
        { check, reveal, clear }[instruction],
      );
      setCellText(newCellText);
      focusGridInput();
    } catch (e) {
      if (e instanceof StateError) return;
      throw e;
    }
  }

  function handleTabKey(direction) {
    if (selectedClue == null) return;
    const nextClue = selectedClue.nextClue(direction);
    handleClueClick(nextClue);
  }

  function handleCellClick(cell, preferredOrientation) {
    const preferredOrientationProvided = preferredOrientation ? true : false;
    preferredOrientation ??= 'across';
    setSelectedCell(cell);
    const cellClueGroups = cell.sortedClueGroups(preferredOrientation);
    const i = cellClueGroups.indexOf(selectedClueGroup);
    if (i >= 0) {
      // If clicked cell is same as currently selected cell, orientation of the
      // selected clue changes (i.e., if across clue is currently selected,
      // down clue gets selected).
      if (cell === selectedCell) {
        setSelectedClueGroup(cellClueGroups[(i + 1) % cellClueGroups.length]);
      } else {
        // If clicked cell belongs to currently selected clue group, but clicked
        // cell is *not* the same as the currently selected cell, then the
        // orientation of the selected clue does *not* change.
        setSelectedClueGroup(cellClueGroups[i]);
      }
    } else {
      const j = cellClueGroups.findIndex(
        clueGroup => cell.beginsClueInGroup(clueGroup)
      );
      if (j >= 0 && !preferredOrientationProvided) {
        // If clicked cell is at the start of a clue and no preferred
        // orientation was provided, then that clue is selected. If clicked cell
        // is at the start of *two* clues, then the across clue is selected.
        setSelectedClueGroup(cellClueGroups[j]);
      } else {
        // If clicked cell belongs to two clues, then the clue with preferred
        // orientation is selected. Otherwise, the sole clue to which the cell
        // belongs is selected.
        setSelectedClueGroup(cellClueGroups[0]);
      }
    }
    focusGridInput();
  }

  function focusGridInput() {
    gridRef.current.focus();
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

  // `letter` is only used when `direction` is 'forwards'.
  function handleTextInput(letter, direction) {
    if (selectedCell == null || selectedClue == null) return;
    const nextCellText = new Map(cellText);
    if (direction === 'backwards') {
      if (nextCellText.delete(selectedCell)) {
        return setCellText(nextCellText);
      }
    } else {
      setCellText(nextCellText.set(selectedCell, letter));
    }
    advanceCell(direction, selectedClue.orientation);
  }

  function advanceCell(direction, orientation) {
    const nextCell = getCell(
      selectedCell,
      orientation,
      direction,
      1,
    );
    if (nextCell === null) {
      const sortedClues = selectedClueGroup.sortedClues;
      const clueIndex = sortedClues.indexOf(selectedClue);
      const nextClue = sortedClues[clueIndex + (
        direction === 'backwards' ? -1 : 1
      )];
      if (nextClue === undefined) return;
      const clueLength = numberOfLetters(nextClue.answer);
      const clueEnd = getCell(
        nextClue.startCell,
        orientation,
        'forwards',
        direction === 'backwards' ? clueLength - 1 : 0
      );
      handleCellClick(clueEnd, orientation);
    } else {
      handleCellClick(nextCell, orientation);
    }
  }

  function handleInputChange(event) {
    const input = event.target.value;
    if (/^[a-zA-Z]$/.test(input)) {
      handleTextInput(input.toUpperCase(), 'forwards');
    }
  }

  function handleKeyDown(key, shiftIsPressed) {
    if (arrowKeys.includes(key)) {
      return handleArrowKey(key);
    }
    if (deleteKeys.includes(key)) {
      return handleTextInput(undefined, 'backwards');
    }
    if (tabKeys.includes(key)) {
      const direction = shiftIsPressed ? 'backwards' : 'forwards';
      return handleTabKey(direction);
    }
  }

  function handleClueClick(clue) {
    setSelectedClueGroup(clue.clueGroup);
    setSelectedCell(clue.startCell);
    focusGridInput();
  }

  const currentClue = (
    <div
      className={'Crossword__current-clue'}
    >
      {selectedClueGroup && (
        <OverflowFade key={selectedClueGroup.id} direction="horizontal">
          <StandaloneClue clueGroup={selectedClueGroup} cellText={cellText} />
        </OverflowFade>
      )}
    </div>
  );

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
      <div className="Crossword__grid-and-controls">
        {currentClue}
        <Grid
          crossword={crossword}
          selectedClueGroup={selectedClueGroup}
          selectedCell={selectedCell}
          cellText={cellText}
          onCellClick={handleCellClick}
          onKeyDown={handleKeyDown}
          onInputChange={handleInputChange}
          ref={gridRef}
        />
        {currentClue}
        <Controls
          onClick={handleControlClick}
        />
      </div>
      <div className="Crossword__clue-containers">
        {orientations.map(orientation => {
          const orientationText = new Map([
            ['across', 'Across'],
            ['down', 'Down'],
          ]).get(orientation);
          return (
            <div
              key={orientation}
              className="Crossword__clue-container"
            >
              <Heading
                className="Crossword__clue-container-heading"
                headingLevel={headingLevel}
              >
                {orientationText}
              </Heading>
              <ClueList
                orientation={orientation}
                crossword={crossword}
                selectedClueGroup={selectedClueGroup}
                selectedClue={selectedClue}
                onClueClick={handleClueClick}
                cellText={cellText}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
