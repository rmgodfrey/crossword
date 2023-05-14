import { handleClick } from './helpers/ClueList/index';
import './styles/ClueList.css';
import useScrollbarShadow from './helpers/useScrollbarShadow';
import Clue from './Clue';

export default function ClueList({
  clueFragments,
  state,
  refs,
  direction,
}) {
  const { overflow, onScrollHandler } = useScrollbarShadow();
  const selectedClue = state.clueState[0];
  let clueListClass = 'ClueList';
  if (overflow) {
    clueListClass += ` ClueList--${overflow}-overflow`;
  };
  return (
    <ul
      onScroll={onScrollHandler}
      className={clueListClass}
      ref={(node) => {
        refs.clueListRefs.current[direction] = node;
      }}
    >
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
            refs,
          })}
        >
          <Clue clueFragment={clueFragment} />
        </li>
      ))}
    </ul>
  );
}
