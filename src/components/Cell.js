import {
  handleClick,
  handleKeyDown,
} from "./helpers/Cell/index";

function belongsToSelectedClue(cellNumber, selectedClue, cells) {
  const clues = Object.values(cells[cellNumber].clues);
  const clueIds = clues.map(clue => clue.clueId);
  return clueIds.includes(selectedClue);
}

export default function Cell({
  x,
  y,
  cellNumber,
  clueNumber,
  cells,
  clues,
  gridDimensions,
  state,
  cellRefs,
}) {
  const selectedCell = state.cellState[0];
  const selectedClue = state.clueState[0];
  const cellText = state.textState[0];
  const cellIsSelected = cellNumber === selectedCell;
  const cellBelongsToSelectedClue = belongsToSelectedClue(
    cellNumber, selectedClue, cells
  )
  return (
    <g
      onClick={() => handleClick({
        cellNumber,
        cells,
        clues,
        state,
        cellRefs,
        hint: null,
      })}
      onKeyDown={(event) => handleKeyDown({
        event,
        cells,
        clues,
        gridDimensions,
        state,
        cellRefs,
      })}
      onMouseDown={(event) => event.preventDefault()}
      ref={(node) => cellRefs.current[cellNumber] = node}
      tabIndex="-1"
    >
      <rect x={x} y={y} width="31" height="31" className={
        'cell'
        + (cellIsSelected ? ' selected-cell' : '')
        + (cellBelongsToSelectedClue ? ' selected' : '')
      } />
      {clueNumber && (
        <text x={x + 1} y={y + 9} className="cell-number">{clueNumber}</text>
      )}
      <text
        x={x + 15.5}
        y={y + 20.925}
        textAnchor="middle"
        className="cell-text"
      >
        {cellText.get(cellNumber)}
      </text>
    </g>
  );
}
