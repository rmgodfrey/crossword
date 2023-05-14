export default function focusAndSelectCell(
  cellNumber,
  selectCell,
  inputRef,
) {
  selectCell(cellNumber);
  // if (cellNumber !== null) {
  //   const inputField = inputRef.current.querySelector('.Grid__input-field');
  //   inputRef.current.style.display = 'block';
  //   inputField.focus();
  // }
}
