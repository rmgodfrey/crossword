import focusAndSelectCell from '../focusAndSelectCell';

export default function handleClick({
  clueFragment,
  state: {
    cellState: [, selectCell],
    clueState: [, selectClue],
  },
  cellRefs,
}) {
  selectClue(clueFragment.clueId);
  focusAndSelectCell(
    clueFragment.start,
    selectCell,
    cellRefs,
  );
}
