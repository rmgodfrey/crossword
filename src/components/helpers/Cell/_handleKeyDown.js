import focusAndSelectCell from '../focusAndSelectCell';
import handleClick from './_handleClick';

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

function handleCursorKey({
  key,
  cells,
  clues,
  gridDimensions,
  state,
  cellRefs,
}) {
  const selectedCell = state.cellState[0];
  const cursorDict = new Map([
    ['ArrowLeft', ['across', 'backwards']],
    ['ArrowRight', ['across', 'forwards']],
    ['ArrowUp', ['down', 'backwards']],
    ['ArrowDown', ['down', 'forwards']]
  ]);
  const [axis, direction] = cursorDict.get(key);
  const newCell = getCell({
    currentCell: selectedCell,
    axis,
    direction,
    distance: 1,
    cells,
    gridDimensions,
  });
  newCell === null || handleClick({
    cellNumber: newCell,
    cells,
    clues,
    state,
    cellRefs,
    hint: cursorDict.get(key)[0],
  });
}

function handleTextInput({
  key, // `key` is only passed when `direction` is 'forwards'
  direction,
  cells,
  clues,
  gridDimensions,
  state,
  cellRefs,
}) {
  const [cellText, changeCellText] = state.textState;
  const [selectedCell] = state.cellState;
  const cellTextLocal = new Map(cellText);
  if (direction === 'backwards') {
    if (cellTextLocal.delete(selectedCell)) {
      return changeCellText(cellTextLocal);
    }
  } else {
    changeCellText(new Map(cellText).set(selectedCell, key));
  }
  advanceCell({
    direction,
    cells,
    clues,
    gridDimensions,
    state,
    cellRefs,
  });
}

function handleTabKey({
  direction,
  clues,
  state,
  cellRefs,
}) {
  const [selectedClue, selectClue] = state.clueState;
  const multiplier = direction === 'backwards' ? -1 : 1;
  let nextClue = selectedClue + 1 * multiplier;
  if (nextClue === clues.length) nextClue = 0;
  if (nextClue === -1) nextClue = clues.length - 1;
  selectClue(nextClue);
  focusAndSelectCell({
    cellNumber: clues[nextClue].fragments[0].start,
    selectCell: state.cellState[1],
    cellRefs,
  });
}

function advanceCell({
  direction,
  cells,
  clues,
  gridDimensions,
  state,
  cellRefs,
}) {
  const [selectedCell, selectCell] = state.cellState;
  const [selectedClue] = state.clueState;
  const offset = direction === 'backwards' ? -1 : 1;
  const axis = clues[selectedClue].direction;
  const fragment = cells[selectedCell].clues[axis].clueFragment;
  const nextCell = getCell({
    currentCell: selectedCell,
    axis,
    direction,
    distance: 1,
    cells,
    gridDimensions,
  });
  if (nextCell === null) {
    const nextFragment = clues[selectedClue].fragments[fragment + offset];
    if (nextFragment === undefined) return;
    const fragmentEnd = getCell({
      currentCell: nextFragment.start,
      axis,
      direction: 'forwards',
      distance: (
        direction === 'backwards' ? getLength(nextFragment.answer) - 1 : 0
      ),
      cells,
      gridDimensions,
    });
    focusAndSelectCell({
      cellNumber: fragmentEnd,
      selectCell,
      cellRefs,
    });
  } else {
    focusAndSelectCell({
      cellNumber: nextCell,
      selectCell,
      cellRefs,
    });
  }
}

function getCell({
  currentCell,
  axis,         // 'across' or 'down'
  direction,    // 'forwards' or 'backwards'
  distance,
  cells,
  gridDimensions: { gridWidth, gridHeight },
}) {
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
  return (newCell in cells) ? newCell : null;
}

export default function handleKeyDown({
  event,
  cells,
  clues,
  gridDimensions,
  state,
  cellRefs,
}) {
  if ([
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown'
  ].includes(event.key)) {
    event.preventDefault();
    return handleCursorKey({
      key: event.key,
      cells,
      clues,
      gridDimensions,
      state,
      cellRefs,
    });
  }
  if (isAlphabetic(event.key)) {
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    return handleTextInput({
      key: event.key.toUpperCase(),
      direction: 'forwards',
      cells,
      clues,
      gridDimensions,
      state,
      cellRefs,
    });
  }
  if (['Backspace', 'Delete'].includes(event.key)) {
    return handleTextInput({
      direction: 'backwards',
      cells,
      clues,
      gridDimensions,
      state,
      cellRefs,
    })
  }
  if (event.key === 'Tab') {
    event.preventDefault();
    const direction = event.shiftKey ? 'backwards' : 'forwards';
    return handleTabKey({
      direction,
      clues,
      state,
      cellRefs,
    });
  }
}
