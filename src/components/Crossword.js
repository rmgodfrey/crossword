import { useState, useRef } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import ClueContainer from './ClueContainer';
import Heading from './Heading';
import {
  createCells,
  createClues,
} from './helpers/Crossword/index';
import './styles/Crossword.css';

const gridWidth = 15;
const gridHeight = gridWidth;

export default function Crossword({ clues, headingLevel }) {
  const cellState = useState(null);
  const clueState = useState(null);
  const textState = useState(new Map());
  const cellRefs = useRef([]);
  const cells = createCells(clues, gridWidth, gridHeight);
  const [acrossClues, downClues] = createClues(clues);

  return (
    <>
      <Heading headingLevel={headingLevel}>Rossword</Heading>
      <div className="Crossword">
        <div className="Crossword__grid-and-controls">
          <Grid
            cells={cells}
            clues={clues}
            clueFragments={[...acrossClues, ...downClues]}
            gridDimensions={{ gridWidth, gridHeight }}
            state={{ cellState, clueState, textState }}
            cellRefs={cellRefs}
          />
          <Controls
            cells={cells}
            state={{ cellState, textState }}
            cellRefs={cellRefs}
          />
        </div>
        <ClueContainer
          clueFragments={acrossClues}
          state={{ cellState, clueState }}
          cellRefs={cellRefs}
          headingLevel={headingLevel + 1}
        >
          Across
        </ClueContainer>
        <ClueContainer
          clueFragments={downClues}
          state={{ cellState, clueState }}
          cellRefs={cellRefs}
          headingLevel={headingLevel + 1}
        >
          Down
        </ClueContainer>
      </div>
    </>
  );
}
