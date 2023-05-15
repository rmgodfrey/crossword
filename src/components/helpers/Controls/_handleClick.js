import focusAndSelectCell from '../focusAndSelectCell';
import getClueCells from '../getClueCells';

export default function handleClick({
  instruction,
  target,
  cells,
  state: {
    cellState: [selectedCell, selectCell],
    clueState: [selectedClue],
    textState: [cellText, changeCellText],
  },
  refs: { inputRef },
}) {
    let cellsToTest = cells;
    if (target === 'letter' || target === 'word') {
      if (selectedCell === null) return;
      if (target === 'letter') {
        cellsToTest = Array(cells.length);
        cellsToTest[selectedCell] = cells[selectedCell];
      } else if (target === 'word') {
        cellsToTest = getClueCells(selectedClue, cells);
      }
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
      } else if (instruction === 'clear') {
        newCellText.delete(index);
      }
    });
    changeCellText(newCellText);
    focusAndSelectCell(
      selectedCell,
      selectCell,
      inputRef,
    );
}
