import Cell from './Cell.js';

const spaceBetweenCells = 1;
const cellWidth = 31;
const cellHeight = cellWidth;

function calculateExtent(cellExtent, numberOfCells, spaceBetweenCells) {
  return cellExtent * numberOfCells + spaceBetweenCells * (numberOfCells + 1);
}

function belongsToSelectedClue(cellNumber, selectedClue, gridLayout) {
  const clues = Object.values(gridLayout[cellNumber].clues);
  const clueIds = clues.map(clue => clue.clueId);
  return clueIds.includes(selectedClue);
}

export default function Grid({
  gridLayout,
  handleCellClick,
  handleKeyDown,
  gridWidth,
  gridHeight,
  selectedCell,
  selectedClue,
  cellText,
  cellRefs,
}) {
  function refCallback(cellNumber) {
    return (node => cellRefs.current[cellNumber] = node);
  }

  return (
    <svg
      viewBox="0 0 481 481"
      className="grid"
    >
      <rect
        x="0"
        y="0"
        width={calculateExtent(cellWidth, gridWidth, spaceBetweenCells)}
        height={calculateExtent(cellHeight, gridHeight, spaceBetweenCells)}
      />
      {gridLayout.map(({ clueNumber }, cellNumber) => (
        <Cell
          key={cellNumber}
          x={spaceBetweenCells + (cellNumber % gridWidth) * (cellWidth + spaceBetweenCells)}
          y={
            spaceBetweenCells + (
              Math.floor(cellNumber / gridWidth)
              * (cellHeight + spaceBetweenCells)
            )
          }
          isSelected={cellNumber === selectedCell}
          belongsToSelectedClue={belongsToSelectedClue(
            cellNumber,
            selectedClue,
            gridLayout,
          )}
          clueNumber={clueNumber}
          cellText={cellText.get(cellNumber)}
          onCellClick={() => handleCellClick(cellNumber)}
          onKeyDown={(event) => handleKeyDown(event)}
          refCallback={refCallback(cellNumber)}
        />
      ))}
    </svg>
  );
}
