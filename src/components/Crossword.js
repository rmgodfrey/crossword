import { useState, useRef, useEffect } from 'react';
import Cell from './Cell';
import Clue from './Clue';
import ClueContainer from './ClueContainer';
import ClueList from './ClueList';
import Controls from './Controls';
import Grid from './Grid';
import Heading from './Heading';

import getCurrentFragment from './helpers/getCurrentFragment';
import './styles/Crossword.css';

export default function Crossword({
  clues,
  gridWidth,
  gridHeight = gridWidth,
  headingLevel = 1,
}) {
  const [selectedClueId, setSelectedClueId] = useState(null);
  const [selectedCellId, setSelectedCellId] = useState(null);
  const [cellTextMap, setCellTextMap] = useState(new Map());

  /*
    const inputRef = useRef(null);
    const clueFragmentRefs = useRef([]);
    const clueListRefs = useRef({});
  */

  const clueFragments = [...acrossClues, ...downClues];
  const currentFragment = getCurrentFragment(
    clueFragments,
    selectedCell,
    selectedClue,
    { cells, gridDimensions: { gridWidth, gridHeight } },
  );

  useEffect(() => {
    function fireScrollEvent() {
      Object.keys(clueListRefs.current).forEach((clueList) => {
        clueListRefs.current[clueList].dispatchEvent(new CustomEvent('scroll'));
      });
    }
    window.addEventListener('resize', fireScrollEvent);
    fireScrollEvent();
    return () => window.removeEventListener('resize', fireScrollEvent);
  }, []);
  useEffect(() => {
    if (selectedCell !== null) {
      const inputField = inputRef.current.querySelector('.Grid__input-field');
      inputRef.current.style.display = 'block';
      inputField.focus();
    }
  });
  useEffect(() => {
    if (
      // TODO: See if the media query can be stored in a variable that can be
      // accessed here and in CSS
      !(window.matchMedia('(max-width: 800px)').matches)
      && clueFragments[currentFragment]
    ) {
      clueFragmentRefs.current[currentFragment].scrollIntoView(
        { block: 'center' }
      );
    }
  });

  const currentClue = (
    <p className="Crossword__current-clue">
    {
      selectedClue === null
      ? ''
      : <Clue
          cells={cells}
          clues={clues}
          clueFragment={clueFragments[currentFragment]}
          cellText={textState[0]}
        />
    }
    </p>
  );

  return (
    <div className="Crossword">
      <Heading
        className="Crossword__heading"
        headingLevel={headingLevel}
      >
        Rossword
      </Heading>
      <div className="Crossword__grid-and-controls">
        {currentClue}
        <Grid
          clues={clues}
          gridWidth={gridWidth}
          gridHeight={gridHeight}
          selectedClueId={selectedClueId}
          selectedCellId={selectedCellId}
          cellTextMap={cellTextMap}
          onCellClick={handleCellClick}
          onKeyDown={handleKeyDown}
          onTextInput={handleTextInput}
        />
        {currentClue}
        <Controls
          onControlClick={handleControlClick}
        />
      </div>
      {['across', 'down'].map(direction => (
        <ClueContainer
          key={direction}
          direction={direction}
        >
          <ClueList
            clues={clues}
            onClueClick={handleClueClick}
          />
        </ClueContainer>
      ))}
    </div>
  );
}

function createCells() {}
// function createClues(clueGroups) {
//   let clues = [];
//   for (let clueGroup of clueGroups) {
//     for (let clue of clueGroups.clues
//       ) {
//       clues.push({ ...clue, clueGroup: clueGroup });
//     }
//   }
//   return clues;
// }
