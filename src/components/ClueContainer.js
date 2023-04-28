import Heading from './Heading';
import ClueList from './ClueList';
import './styles/ClueContainer.css';

export default function ClueContainer({
  children,
  clueFragments,
  state,
  cellRefs,
  headingLevel,
}) {
  return (
    <div className="ClueContainer">
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
