export default function Cell({
  x,
  y,
  clueNumber,
  onCellClick,
  onKeyDown,
  isSelected,
  belongsToSelectedClue,
  cellText,
  refCallback,
  isStartOfClue
}) {
  return (
    <g
      onClick={onCellClick}
      onKeyDown={onKeyDown}
      ref={refCallback}
      tabIndex="-1"
      onMouseDown={(event) => event.preventDefault()}
    >
      <rect x={x} y={y} width="31" height="31" className={
        'cell'
        + (isSelected ? ' selected-cell' : '')
        + (belongsToSelectedClue ? ' selected' : '')
      } />
      {clueNumber && (
        <text x={x + 1} y={y + 9} className="cell-number">{clueNumber}</text>
      )}
      <text x={x + 15.5} y={y + 20.925} textAnchor="middle" className="cell-text">
        {cellText}
      </text>
    </g>
  );
}
