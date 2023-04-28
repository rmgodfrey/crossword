import { handleClick } from './helpers/ClueList/index';
import './styles/ClueList.css';

export default function ClueList({
  clueFragments,
  state,
  cellRefs,
}) {
  const selectedClue = state.clueState[0];
  return (
    <ul className="ClueList">
      {clueFragments.map((clueFragment, index) => (
        <li
          key={index}
          className={
            'ClueList__clue'
            + (selectedClue === clueFragment.clueId ? ' ClueList__clue--selected' : '')
          }
          onClick={() => handleClick({
            clueFragment,
            state,
            cellRefs,
          })}
        >
          <span className={'ClueList__clue-number'}>
            {clueFragment.clueNumbers.join()}
          </span>
          {' '}
          {clueFragment.clueText}
        </li>
      ))}
    </ul>
  );
}
