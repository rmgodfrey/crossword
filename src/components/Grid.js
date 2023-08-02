import Cell from './Cell';
import './styles/Grid.css';

export default function Grid({
  cells,
  gridWidth,
  gridHeight,
  selectedClue,
  selectedCell,
  cellTextMap,
  onCellClick,
  helpers: {
    containsCell,
    step,
    getRowOrColumn,
    getColumn,
    getRow,
    getExtremeCell,
    dimensionLengthInCells,
  }
}) {
  const cellLength = 31;
  const spaceBetweenCells = 1;

  // Returns true if `cell` is at {beginning, end} of a {column, row}, and false
  // otherwise. If `orientation` is 'across', then result is based on column, and
  // if `orientation` is 'down, result is based on row. If `edge` is 'start', then
  // result is based on beginning, and if `edge` is 'end', result is based on
  // end.
  function isAtEdgeOfGrid(cell, orientation, edge) {
    const extremity = getExtremeCell(orientation, edge);
    return getRowOrColumn(cell, orientation) === extremity;
  }

  function isStartOfCellSequence(cell, cells) {
    if (!cells.includes(cell)) {
      throw new Error('`cellPositions` must include `cellId`');
    }
    return ['across', 'down'].some(orientation => (
      cells.includes(cell + step(1, orientation))
      && !isAtEdgeOfGrid(cell, orientation, 'end')
    ) && (
      isAtEdgeOfGrid(cell, orientation, 'start')
      || !cells.includes(cell - step(1, orientation))
    ));
  }

  function getCellPosition(cell, orientation) {
    if (orientation === 'across') {
      return (
        spaceBetweenCells
        + getColumn(cell) * (cellLength + spaceBetweenCells)
      );
    } else if (orientation === 'down') {
      return (
        spaceBetweenCells
        + (
          getRow(cell)
          * (cellLength + spaceBetweenCells)
        )
      );
    } else {
      throw new Error('`orientation` must be either "across" or "down"');
    }
  }

  function belongsToSelectedClue(cell) {
    if (selectedClue === null) return false;
    return containsCell(selectedClue, cell);
  }

  function dimensionLengthInPixels(orientation) {
    const numberOfCells = dimensionLengthInCells(orientation);
    return cellLength * numberOfCells
           + spaceBetweenCells * (numberOfCells + 1);
  }

  function createCellComponents() {
    const cellComponents = [];
    let currentClueNumber = 1;
    for (let i = 0; i < gridWidth * gridHeight; i++) {
      if (cells.includes(i)) {
        let clueNumber;
        if (isStartOfCellSequence(i, cells)) {
          clueNumber = currentClueNumber++;
        }
        cellComponents.push(
          <Cell
            key={i}
            position={{
              x: getCellPosition(i, 'across'),
              y: getCellPosition(i, 'down')
            }}
            selected={
              i === selectedCell ? 'cell' :
              belongsToSelectedClue(i) ? 'clue' :
              null
            }
            clueNumber={clueNumber}
            onClick={() => onCellClick(i)}
          >
            {cellTextMap.get(i)}
          </Cell>
        );
      }
    }
    return cellComponents;
  }

  return (
    <div className="Grid">
      <svg
        className="Grid__graphics"
        viewBox={`
          0
          0
          ${dimensionLengthInPixels('across')}
          ${dimensionLengthInPixels('down')}
        `}
      >
        <rect
          x="0"
          y="0"
          width={dimensionLengthInPixels('across')}
          height={dimensionLengthInPixels('down')}
        />
        {createCellComponents()}
      </svg>
      {/*<div
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
          maxLength="1"
          autoComplete="off"
          spellCheck="false"
          value=""
          onKeyDown={(event) => handleKeyDown(event, props)}
          onChange={(event) => handleChange(event, props)}
        />
      </div>*/}
    </div>
  );
}
