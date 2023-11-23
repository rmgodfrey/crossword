import './styles/Cell.css';

export default function Cell({
  position,
  selected,
  clueNumber,
  onClick,
  children,
}) {
  return (
    <g onClick={onClick}>
      <rect x={position.x} y={position.y} width="31" height="31" className={
        'Cell' + (
          selected === 'cell' ? ' Cell--selected-cell' :
          selected === 'clue-group' ? ' Cell--selected-clue-group' : ''
        )
      } />
      {clueNumber && (
        <text
          x={position.x + 1}
          y={position.y + 9}
          className="Cell__number"
        >
          {clueNumber}
        </text>
      )}
      <text
        x={position.x + 15.5}
        y={position.y + 20.925}
        textAnchor="middle"
        className="Cell__text"
      >
        {children}
      </text>
    </g>
  );
}
