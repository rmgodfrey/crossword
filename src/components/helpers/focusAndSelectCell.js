export default function focusAndSelectCell(
  cellNumber,
  selectCell,
  inputRef,
) {
  selectCell(cellNumber);

  // Focusing has been moved into `useEffect` in `crossword.js`
  // At some point `focusAndSelectCell` will be removed, and all calls replaced
  // with `selectCell`

  /*
    if (cellNumber !== null) {
      const inputField = inputRef.current.querySelector('.Grid__input-field');
      inputRef.current.style.display = 'block';
      inputField.focus();
    }
  */
}
