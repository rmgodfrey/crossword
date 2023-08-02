import Crossword from './Crossword';
// import Heading from './Heading';

const headingLevel = 1;

function numberOfLetters(string) {
  return string.replaceAll(/\W/g, '').length;
}

export default function App({
  crosswordData,
}) {
  function createCrossword({ id, gridWidth, clues }) {
    function step(n, orientation) {
      if (orientation === 'across') {
        return n;
      } else if (orientation === 'down') {
        return gridWidth * n;
      } else {
        throw new Error('`orientation` must be either "across" or "down"');
      }
    }

    function* generateCellsFromFragment(fragment, orientation) {
      const fragmentAnswerLength = numberOfLetters(fragment.answer);
      for (let i = 0; i < fragmentAnswerLength; i++) {
        yield (fragment.start + step(i, orientation));
      }
    }

    function* generateCellsFromClue(clue) {
      for (const fragment of clue.fragments) {
        for (const cell of generateCellsFromFragment(
          fragment, clue.orientation
        )) {
          yield cell;
        }
      }
    }

    function getCells() {
      const cellPositions = [];
      for (const clue of clues) {
        for (const cell of generateCellsFromClue(clue)) {
          cellPositions.push(cell);
        }
      }
      return cellPositions;
    }

    return (
      <Crossword
        key={id}
        cells={getCells()}
        clues={clues}
        gridWidth={gridWidth}
        headingLevel={headingLevel}
        helpers={{
          step,
          generateCellsFromClue,
          generateCellsFromFragment,
        }}
      />
    );
  }

  return (
    <>
      {/*<Heading
        className="App__heading"
        headingLevel={headingLevel}
      >
        Rossword
      </Heading>*/}
      {crosswordData.map(createCrossword)}
    </>
  );
}
