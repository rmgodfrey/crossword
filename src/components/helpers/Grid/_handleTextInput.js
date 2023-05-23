import focusAndSelectCell from '../focusAndSelectCell';
import getLength from '../getLength';
import getCell from '../getCell';

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

export default function handleTextInput(
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
