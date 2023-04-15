export default function ClueList({
  clues,
  selectedClue,
  handleClueClick,
}) {
  return (
    <ol className="clue-list">
      {clues.map((clue, index) => (
        <li
          key={index}
          className={
            'clue-item'
            + (selectedClue === clue.clueId ? ' selected' : '')
          }
          onClick={() => handleClueClick(clue)}
        >
          <span className={'bold'}>
            {clue.clueNumbers.join()}
          </span>
          {' '}
          {clue.clueText}
        </li>
      ))}
    </ol>
  );
}
