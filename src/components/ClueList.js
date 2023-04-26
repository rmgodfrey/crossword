import { handleClick } from './helpers/ClueList/index';

export default function ClueList({
  clueFragments,
  state,
  cellRefs,
}) {
  const selectedClue = state.clueState[0];
  return (
    <ol className="clue-list">
      {clueFragments.map((clueFragment, index) => (
        <li
          key={index}
          className={
            'clue-item'
            + (selectedClue === clueFragment.clueId ? ' selected' : '')
          }
          onClick={() => handleClick({
            clueFragment,
            state,
            cellRefs,
          })}
        >
          <span className={'bold'}>
            {clueFragment.clueNumbers.join()}
          </span>
          {' '}
          {clueFragment.clueText}
        </li>
      ))}
    </ol>
  );
}
