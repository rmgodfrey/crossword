import focusAndSelectCell from '../focusAndSelectCell';
import mod from '../mod';
import { handleClick } from '../Cell/index';

function getLength(answer) {
  return answer.replaceAll(/[- ]/g, '').length;
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

function handleCursorKey(key, props) {
  const selectedCell = props.state.cellState[0];
  const cursorDict = new Map([
    ['ArrowLeft', ['across', 'backwards']],
    ['ArrowRight', ['across', 'forwards']],
    ['ArrowUp', ['down', 'backwards']],
    ['ArrowDown', ['down', 'forwards']]
  ]);
  const [axis, direction] = cursorDict.get(key);
  const newCell = getCell(selectedCell, axis, direction, 1, props);
  newCell === null || handleClick({
    ...props,
    cellNumber: newCell,
  }, cursorDict.get(key)[0]);
}

function handleTextInput(
  key, // `key` is only passed when `direction` is 'forwards'
  direction,
  props,
) {
  const {
    state: {
      cellState: [selectedCell],
      textState: [cellText, changeCellText],
    },
  } = props;
  const cellTextLocal = new Map(cellText);
  if (direction === 'backwards') {
    if (cellTextLocal.delete(selectedCell)) {
      return changeCellText(cellTextLocal);
    }
  } else {
    changeCellText(new Map(cellText).set(selectedCell, key));
  }
  advanceCell(direction, props);
}

function handleTabKey(direction, {
  cells,
  clueFragments,
  gridDimensions,
  state: {
    cellState: [selectedCell, selectCell],
    clueState: [selectedClue, selectClue],
  },
  inputRef,
}) {
  const nextFragment = getNextFragment(
    selectedCell,
    selectedClue,
    clueFragments,
    direction,
    { cells, gridDimensions }
  );
  selectClue(nextFragment.clueId);
  focusAndSelectCell(
    nextFragment.start,
    selectCell,
    inputRef,
  );
}

function getNextFragment(
  cellNumber,
  clueNumber,
  clueFragments,
  direction,
  props,
) {
  const offset = direction === 'backwards' ? -1 : 1;
  const clueFragmentNumber = clueFragments.findIndex(
    clueFragment => (
      containsCell(clueFragment, cellNumber, props)
      && clueFragment.clueId === clueNumber
    )
  );
  let nextClueFragmentNumber = mod(
    clueFragmentNumber + offset,
    clueFragments.length
  );
  return clueFragments[nextClueFragmentNumber];
}

function containsCell(clueFragment, cellNumber, props) {
  const gridWidth = props.gridDimensions.gridWidth;
  const axis = clueFragment.direction;
  const start = clueFragment.start;
  if (axis === 'down' && cellNumber % gridWidth !== start % gridWidth) {
    return false;
  }
  const clueFragmentLength = getLength(clueFragment.answer);
  const end = getCell(start, axis, 'forwards', clueFragmentLength - 1, props);
  return cellNumber >= start && cellNumber <= end;
}

function advanceCell(direction, {
  cells,
  clues,
  gridDimensions,
  state,
  inputRef,
}) {
  const [selectedCell, selectCell] = state.cellState;
  const [selectedClue] = state.clueState;
  const offset = direction === 'backwards' ? -1 : 1;
  const axis = clues[selectedClue].direction;
  const fragment = cells[selectedCell].clues[axis].clueFragment;
  const nextCell = getCell(
    selectedCell,
    axis,
    direction,
    1,
    { cells, gridDimensions },
  );
  if (nextCell === null) {
    const nextFragment = clues[selectedClue].fragments[fragment + offset];
    if (nextFragment === undefined) return;
    const fragmentEnd = getCell(
      nextFragment.start,
      axis,
      'forwards',
      direction === 'backwards' ? getLength(nextFragment.answer) - 1 : 0,
      { cells, gridDimensions },
    );
    focusAndSelectCell(fragmentEnd, selectCell, inputRef);
  } else {
    focusAndSelectCell(nextCell, selectCell, inputRef);
  }
}

function getCell(
  currentCell,
  axis,         // 'across' or 'down'
  direction,    // 'forwards' or 'backwards'
  distance,
  {
    cells,
    gridDimensions: { gridWidth, gridHeight }
  },
) {
  const [step, magnitude, axisLength] = (
    axis === 'across'
    ? [1, currentCell % gridWidth, gridWidth]
    : [gridWidth, Math.floor(currentCell / gridWidth), gridHeight]
  );
  const [multiplier, isOutOfBounds] = (
    direction === 'forwards'
    ? [distance, magnitude + distance > axisLength - 1]
    : [-distance, magnitude - distance < 0]
  );
  const newCell = currentCell + step * multiplier;
  if (isOutOfBounds) return null;
  return (newCell in cells) ? newCell : null;
}

export default function handleKeyDown(event, props) {
  if ([
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown'
  ].includes(event.key)) {
    event.preventDefault();
    return handleCursorKey(event.key, props);
  }
  if (isAlphabetic(event.key)) {
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    return handleTextInput(event.key.toUpperCase(), 'forwards', props);
  }
  if (['Backspace', 'Delete'].includes(event.key)) {
    return handleTextInput(undefined, 'backwards', props);
  }
  if (event.key === 'Tab') {
    event.preventDefault();
    const direction = event.shiftKey ? 'backwards' : 'forwards';
    return handleTabKey(direction, props);
  }
}
