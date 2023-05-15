import { handleClick } from './helpers/ClueList/index';
import './styles/ClueList.css';
import useScrollbarShadow from './helpers/useScrollbarShadow';
import Clue from './Clue';

export default function ClueList({
  cells,
  clues,
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
          ref={node => refs.clueFragmentRefs.current.push(node)}
        >
          <Clue
            cells={cells}
            clues={clues}
            clueFragment={clueFragment}
            cellText={state.textState[0]}
          />
        </li>
      ))}
    </ul>
  );
}
