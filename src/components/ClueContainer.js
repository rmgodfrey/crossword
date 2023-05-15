import Heading from './Heading';
import ClueList from './ClueList';
import './styles/ClueContainer.css';

export default function ClueContainer({
  children,
  cells,
  clues,
  clueFragments,
  state,
  refs,
  direction,
  headingLevel,
}) {
  return (
    <div className="ClueContainer">
      <Heading headingLevel={headingLevel}>
        {children}
      </Heading>
      <ClueList
        cells={cells}
        clues={clues}
        clueFragments={clueFragments}
        state={state}
        refs={refs}
        direction={direction}
      />
    </div>
  );
}
