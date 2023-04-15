import Heading from './Heading.js';
import ClueList from './ClueList.js';

export default function ClueContainer({
  clues,
  selectedClue,
  handleClueClick,
  headingLevel,
  children
}) {
  return (
    <div className="clue-container">
      <Heading headingLevel={headingLevel}>
        {children}
      </Heading>
      <ClueList
        clues={clues}
        selectedClue={selectedClue}
        handleClueClick={handleClueClick}
      />
    </div>
  );
}
