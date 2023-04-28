import {
  handleClick,
  handleKeyDown,
} from './helpers/Cell/index';
import './styles/Cell.css';

function belongsToSelectedClue(cellNumber, selectedClue, cells) {
  const clues = Object.values(cells[cellNumber].clues);
  const clueIds = clues.map(clue => clue.clueId);
  return clueIds.includes(selectedClue);
}

export default function Cell(props) {
  const {
    x,
    y,
    cellNumber,
    clueNumber,
    cells,
    state: {
      cellState: [selectedCell],
      clueState: [selectedClue],
      textState: [cellText],
    },
    cellRefs,
  } = props;
  const cellIsSelected = cellNumber === selectedCell;
  const cellBelongsToSelectedClue = belongsToSelectedClue(
    cellNumber, selectedClue, cells
  )
  return (
    <g
      onClick={() => handleClick(props, null)}
      onKeyDown={(event) => handleKeyDown(event, props)}
      onMouseDown={(event) => event.preventDefault()}
      ref={(node) => cellRefs.current[cellNumber] = node}
      tabIndex="-1"
    >
      <rect x={x} y={y} width="31" height="31" className={
        'Cell'
        + (cellIsSelected ? ' Cell--selected-cell' : '')
        + (cellBelongsToSelectedClue ? ' Cell--selected-clue' : '')
      } />
      {clueNumber && (
        <text x={x + 1} y={y + 9} className="Cell__number">{clueNumber}</text>
      )}
      <text
        x={x + 15.5}
        y={y + 20.925}
        textAnchor="middle"
        className="Cell__text"
      >
        {cellText.get(cellNumber)}
      </text>
    </g>
  );
}
