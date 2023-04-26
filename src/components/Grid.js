import Cell from './Cell';

const spaceBetweenCells = 1;
const cellWidth = 31;
const cellHeight = cellWidth;

function calculateExtent(cellExtent, numberOfCells, spaceBetweenCells) {
  return cellExtent * numberOfCells + spaceBetweenCells * (numberOfCells + 1);
}

export default function Grid({
  cells,
  clues,
  gridDimensions: { gridWidth, gridHeight },
  state,
  cellRefs,
}) {
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
      {cells.map(({ clueNumber }, cellNumber) => (
        <Cell
          key={cellNumber}
          x={
            spaceBetweenCells
            + (cellNumber % gridWidth) * (cellWidth + spaceBetweenCells)
          }
          y={
            spaceBetweenCells
            + (
              Math.floor(cellNumber / gridWidth)
              * (cellHeight + spaceBetweenCells)
            )
          }
          cellNumber={cellNumber}
          clueNumber={clueNumber}
          cells={cells}
          clues={clues}
          gridDimensions={{ gridWidth, gridHeight }}
          state={state}
          cellRefs={cellRefs}
        />
      ))}
    </svg>
  );
}
