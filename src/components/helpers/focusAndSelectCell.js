export default function focusAndSelectCell({
  cellNumber,
  selectCell,
  cellRefs,
}) {
  cellRefs.current[cellNumber]?.focus();
  selectCell(cellNumber);
}
