import focusAndSelectCell from '../focusAndSelectCell';
import getCurrentFragment from '../getCurrentFragment';
import getLength from '../getLength';
import getCell from '../getCell';
import mod from '../mod';
import { handleClick } from '../Cell/index';

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
  refs: { inputRef },
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
  const clueFragmentNumber = getCurrentFragment(
    clueFragments,
    cellNumber,
    clueNumber,
    props,
  );
  let nextClueFragmentNumber = mod(
    clueFragmentNumber + offset,
    clueFragments.length
  );
  return clueFragments[nextClueFragmentNumber];
}

function advanceCell(direction, {
  cells,
  clues,
  gridDimensions,
  state,
  refs: { inputRef },
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

export default function handleKeyDown(event, props) {
  if (event.type === 'change') {
    if (isAlphabetic(event.target.value)) {
      return handleTextInput(
        event.target.value.toUpperCase(),
        'forwards',
        props
      );
    }
  }
  if ([
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown'
  ].includes(event.key)) {
    event.preventDefault();
    return handleCursorKey(event.key, props);
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
