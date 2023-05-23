import handleTextInput from './_handleTextInput';
import focusAndSelectCell from '../focusAndSelectCell';
import getCurrentFragment from '../getCurrentFragment';
import getCell from '../getCell';
import mod from '../mod';
import { handleClick } from '../Cell/index';

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
  if (['Backspace', 'Delete'].includes(event.key)) {
    return handleTextInput(undefined, 'backwards', props);
  }
  if (event.key === 'Tab') {
    event.preventDefault();
    const direction = event.shiftKey ? 'backwards' : 'forwards';
    return handleTabKey(direction, props);
  }
}
