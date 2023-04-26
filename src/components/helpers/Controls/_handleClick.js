import focusAndSelectCell from '../focusAndSelectCell';

export default function handleClick({
  instruction,
  target,
  cells,
  state: {
    cellState: [selectedCell, selectCell],
    textState: [cellText, changeCellText],
  },
  cellRefs,
}) {
    let cellsToTest = cells;
    if (target === 'letter') {
      if (selectedCell === null) return;
      cellsToTest = Array(cells.length);
      cellsToTest[selectedCell] = cells[selectedCell];
    }
    const newCellText = new Map(cellText);
    cellsToTest.forEach((cell, index) => {
      if (instruction === 'check') {
        if (
          cellText.get(index)?.toUpperCase() !== cell.answer.toUpperCase()
        ) {
          newCellText.delete(index);
        }
      } else if (instruction === 'reveal') {
        newCellText.set(index, cell.answer.toUpperCase());
      }
    });
    changeCellText(newCellText);
    focusAndSelectCell({
      cellNumber: selectedCell,
      selectCell,
      cellRefs,
    });
}
