import Cell from './Cell';
import {
  handleKeyDown,
} from './helpers/Grid/index';
import './styles/Grid.css';

const spaceBetweenCells = 1;
const cellWidth = 31;
const cellHeight = cellWidth;

function calculateExtent(cellExtent, numberOfCells, spaceBetweenCells) {
  return cellExtent * numberOfCells + spaceBetweenCells * (numberOfCells + 1);
}

function getInputPosition(
  cellNumber,
  { gridWidth, gridHeight },
  axis
) {
  const numberOfCells = axis === 'y' ? gridHeight : gridWidth;
  if (cellNumber === null) {
    return 'unset';
  } else {
    return `${
      getPosition(cellNumber, gridWidth, axis)
      / calculateExtent(cellHeight, numberOfCells, spaceBetweenCells)
      * 100
    }%`;
  }
}

function getPosition(
  cellNumber,
  gridWidth,
  axis
) {
  if (axis === 'x') {
    return (
      spaceBetweenCells
      + (cellNumber % gridWidth) * (cellWidth + spaceBetweenCells)
    );
  } else if (axis === 'y') {
    return (
      spaceBetweenCells
      + (
        Math.floor(cellNumber / gridWidth)
        * (cellHeight + spaceBetweenCells)
      )
    );

  }
}

export default function Grid(props) {
  const {
    cells,
    gridDimensions: { gridWidth, gridHeight },
    state: {
      cellState: [selectedCell],
    },
    refs,
  } = props;
  return (
    <div className="Grid">
      <svg
        className="Grid__graphics"
        viewBox={`
          0
          0
          ${calculateExtent(cellWidth, gridWidth, spaceBetweenCells)}
          ${calculateExtent(cellHeight, gridHeight, spaceBetweenCells)}
        `}
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
            x={getPosition(cellNumber, gridWidth, 'x')}
            y={getPosition(cellNumber, gridWidth, 'y')}
            cellNumber={cellNumber}
            clueNumber={clueNumber}
            {...props}
          />
        ))}
      </svg>
      <div
        className="Grid__input-wrapper"
        ref={refs.inputRef}
        style={{
          width: `${100 / gridWidth}%`,
          height: `${100 / gridHeight}%`,
          top: getInputPosition(
            selectedCell,
            { gridWidth, gridHeight },
            'y'
          ),
          left: getInputPosition(
            selectedCell,
            { gridWidth, gridHeight },
            'x'
          ),
        }}
      >
        <input
          className="Grid__input-field"
          type="text"
          tabIndex="-1"
          value=""
          onKeyDown={(event) => handleKeyDown(event, props)}
          onBeforeInput={(event) => handleKeyDown(event, props)}
        />
      </div>
    </div>
  );
}
