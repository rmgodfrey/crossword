import './styles/Clue.css';

function joinByCommas(array) {
  return array.join(',\u200B');
}

function isClueFinished(clue, cellText) {
  return Array.from(clue.clueGroup.getCells()).every((cell) => {
    return cellText.has(cell)
  });
}


export default function Clue({
  isSelected,
  type,
  clue,
  cellText,
  onClick = () => {},
}) {
  let numbers;
  let displayClueLength;
  if (clue.isFirstClueOfGroup()) {
    numbers = clue.clueGroup.clueNumbers;
    displayClueLength = true;
  } else {
    numbers = [clue.number];
    displayClueLength = false;
  }
  const isFinished = isClueFinished(clue, cellText);

  return (
    <div
      className={
        'Clue '
        + (isSelected ? 'Clue--selected ' : '')
        + (isFinished ? 'Clue--finished ' : '')
        + (type === 'standalone' ? 'Clue--standalone ' : 'Clue--listed ')
      }
      onClick={onClick}
    >
      <div className={'Clue__clue-number'}>
        {joinByCommas(numbers)}
      </div>
      <div className={'Clue__clue-text'}>
        {clue.text}
        {displayClueLength && ` ${clue.clueGroup.numberOfLetters}`}
      </div>
    </div>
  );
}
