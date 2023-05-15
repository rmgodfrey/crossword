import { useState, useRef, useEffect } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import ClueContainer from './ClueContainer';
import Clue from './Clue';
import Heading from './Heading';
import {
  createCells,
  createClues,
} from './helpers/Crossword/index';
import getCurrentFragment from './helpers/getCurrentFragment';
import './styles/Crossword.css';

const gridWidth = 15;
const gridHeight = gridWidth;

export default function Crossword({ clues, headingLevel }) {
  const cellState = useState(null),
        [selectedCell] = cellState;
  const clueState = useState(null),
        [selectedClue] = clueState;
  const textState = useState(new Map());
  const inputRef = useRef(null);
  const clueFragmentRefs = useRef([]);
  const clueListRefs = useRef({});

  const cells = createCells(clues, gridWidth, gridHeight);
  const [acrossClues, downClues] = createClues(clues);
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
      <Heading headingLevel={headingLevel} className="Crossword__heading">
        Rossword
      </Heading>
      <div className="Crossword__grid-and-controls">
        {currentClue}
        <div className="Crossword__grid">
          <Grid
            cells={cells}
            clues={clues}
            clueFragments={clueFragments}
            gridDimensions={{ gridWidth, gridHeight }}
            state={{ cellState, clueState, textState }}
            refs={{ inputRef }}
          />
        </div>
        {currentClue}
        <div className="Crossword__controls">
          <Controls
            cells={cells}
            state={{ cellState, clueState, textState }}
            refs={{ inputRef }}
          />
        </div>
      </div>
      <div className="
        Crossword__clue-container
        Crossword__clue-container--across
      ">
        <ClueContainer
          cells={cells}
          clues={clues}
          clueFragments={acrossClues}
          state={{ cellState, clueState, textState }}
          refs={{ clueFragmentRefs, clueListRefs, inputRef }}
          headingLevel={headingLevel + 1}
          direction="across"
        >
          Across
        </ClueContainer>
      </div>
      <div className="
        Crossword__clue-container
        Crossword__clue-container--down
      ">
        <ClueContainer
          cells={cells}
          clues={clues}
          clueFragments={downClues}
          state={{ cellState, clueState, textState }}
          refs={{ clueFragmentRefs, clueListRefs, inputRef }}
          headingLevel={headingLevel + 1}
          direction="down"
        >
          Down
        </ClueContainer>
      </div>
    </div>
  );
}
