import Heading from './Heading';
import ClueList from './ClueList';

export default function ClueContainer({
  children,
  clueFragments,
  state,
  cellRefs,
  headingLevel,
}) {
  return (
    <div className="clue-container">
      <Heading headingLevel={headingLevel}>
        {children}
      </Heading>
      <ClueList
        clueFragments={clueFragments}
        state={state}
        cellRefs={cellRefs}
      />
    </div>
  );
}
