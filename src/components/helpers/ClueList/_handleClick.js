import focusAndSelectCell from '../focusAndSelectCell';

export default function handleClick({
  clueFragment,
  state: {
    cellState: [, selectCell],
    clueState: [, selectClue],
  },
  inputRef,
}) {
  selectClue(clueFragment.clueId);
  focusAndSelectCell(
    clueFragment.start,
    selectCell,
    inputRef,
  );
}
