import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import Cell from './Cell';
import './styles/Grid.css';
import { bindMethods } from '../helpers/index';

const cellLength = 31;
const spaceBetweenCells = 1;
// `gridOverflow` necessary for hyphen separators to hang off end of grid.
const gridOverflow = 10;

function getCellPositionX(cell) {
  return (
    spaceBetweenCells
    + cell.column * (cellLength + spaceBetweenCells)
  );
}

function getCellPositionY(cell) {
  return (
    spaceBetweenCells
    + (
      cell.row
      * (cellLength + spaceBetweenCells)
    )
  );
}

function getCellPosition(cell, orientation) {
  if (orientation === 'across') {
    return getCellPositionX(cell);
  } else if (orientation === 'down') {
    return getCellPositionY(cell);
  } else if (!orientation) {
    return {
      x: getCellPositionX(cell),
      y: getCellPositionY(cell),
    };
  } else {
    throw new Error(
      'If provided, `orientation` must be either "across" or "down".'
    );
  }
}

function GridSeparator({
  mainAxisExtent,
  mainAxisOffset,
  crossAxisExtent,
  crossAxisOffset,
  cellPosition,
  orientation,
  className
}) {
  let mainAxis, crossAxis, width, height;
  if (orientation === 'across') {
    mainAxis  = 'x';
    crossAxis = 'y';
    width = mainAxisExtent;
    height = crossAxisExtent;
  }
  if (orientation === 'down') {
    mainAxis  = 'y';
    crossAxis = 'x';
    width = crossAxisExtent;
    height = mainAxisExtent;
  }
  const rectProps = {
    [mainAxis]: cellPosition[mainAxis] + cellLength - mainAxisOffset,
    [crossAxis]: cellPosition[crossAxis] + crossAxisOffset,
    width,
    height,
  }
  return <rect className={className} {...rectProps} />
}

function GridSpaceSeparator({ cellPosition, orientation }) {
  const mainAxisExtent = 3;
  return <GridSeparator
    mainAxisExtent={mainAxisExtent}
    mainAxisOffset={mainAxisExtent}
    crossAxisExtent={cellLength}
    crossAxisOffset={0}
    {...{cellPosition, orientation}}
  />;
}

function GridHyphenSeparator({
  cellPosition,
  orientation,
  selected,
}) {
  const mainAxisExtent = 12;
  const className = 'Grid__hyphen-separator';
  const classes = `${className} ${className}--selected-${selected}`
  return <GridSeparator
    mainAxisExtent={mainAxisExtent}
    mainAxisOffset={mainAxisExtent / 2}
    crossAxisExtent={2}
    crossAxisOffset={cellLength / 2}
    className={classes}
    {...{cellPosition, orientation}}
  />;
}

export default forwardRef(function Grid({
  crossword,
  selectedCell,
  selectedClueGroup,
  cellText,
  onCellClick,
  onKeyDown,
  onInputChange,
}, parentRef) {
  const cursorRef = useRef(null);
  const cursorRefCallback = useCallback((node) => {
    cursorRef.current = node;
    focusCursorNode();
  }, []);
  useImperativeHandle(parentRef, () => {
    return {
      focus() {
        focusCursorNode();
      }
    };
  }, []);

  const { clueGroups } = bindMethods(crossword);

  function focusCursorNode() {
    cursorRef.current?.focus();
  }

  function dimensionLengthInPixels(orientation) {
    const numberOfCells = crossword.dimensionLengthInCells(orientation);
    return (
      cellLength * numberOfCells
      + spaceBetweenCells * (numberOfCells + 1)
    );
  }

  function getInputPosition(orientation) {
    if (selectedCell === null) {
      return '';
    } else {
      return `${
        getCellPosition(selectedCell, orientation)
        / dimensionLengthInPixels(orientation)
        * 100
      }%`;
    }
  }

  function belongsToSelectedClueGroup(cell) {
    if (selectedClueGroup === null) return false;
    return selectedClueGroup.containsCell(cell);
  }

  const gridSeparators = [];
  for (const clueGroup of clueGroups) {
    const orientation = clueGroup.orientation;
    const separatorChars = clueGroup.answer.split(/[a-z]/i);
    const cells = [null, ...clueGroup.getCells()];
    for (const [i, cell] of cells.entries()) {
      if (cell) {
        const cellPosition = getCellPosition(cell);
        const inSelectedCell = selectedCell === cell;
        const inSelectedClueGroup = Boolean(
          selectedClueGroup?.containsCell(cell)
        );
        const selected = (
          inSelectedCell ? 'cell' :
          inSelectedClueGroup ? 'clue-group' : ''
        );

        function addGridSeparator(SeparatorType) {
          gridSeparators.push(<SeparatorType
            key={`${cell.number}-${SeparatorType.name}`}
            cellPosition={cellPosition}
            orientation={orientation}
            selected={selected}
          />);
        }

        if (separatorChars[i].includes(' ')) {
          addGridSeparator(GridSpaceSeparator);
        }
        if (separatorChars[i].includes('-')) {
          addGridSeparator(GridHyphenSeparator);
        }
      }
    }
  }

  return (
    <div className="Grid">
      <svg
        className="Grid__graphics"
        viewBox={`
          0
          0
          ${dimensionLengthInPixels('across') + gridOverflow}
          ${dimensionLengthInPixels('down') + gridOverflow}
        `}
        style={{
          marginRight: `${-(
            (gridOverflow / dimensionLengthInPixels('across')) * 100
          )}%`,
          marginBottom: `${-(
            (gridOverflow / dimensionLengthInPixels('down')) * 100
          )}%`,
        }}
      >
        <rect
          x="0"
          y="0"
          width={dimensionLengthInPixels('across')}
          height={dimensionLengthInPixels('down')}
        />
        {crossword.cells.map((cell) => (
          <Cell
            key={cell.number}
            position={{
              x: getCellPosition(cell, 'across'),
              y: getCellPosition(cell, 'down')
            }}
            selected={
              cell === selectedCell ? 'cell' :
              belongsToSelectedClueGroup(cell) ? 'clue-group' :
              null
            }
            clueNumber={cell.clueNumber}
            onClick={() => onCellClick(cell)}
          >
            {cellText.get(cell)}
          </Cell>
        ))}
        <g>{gridSeparators}</g>
      </svg>
      {selectedCell && <div
        className="Grid__input-wrapper"
        style={{
          width: `${100 / crossword.gridWidth}%`,
          height: `${100 / crossword.gridHeight}%`,
          top: getInputPosition('down'),
          left: getInputPosition('across'),
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
          onKeyDown={onKeyDown}
          onChange={onInputChange}
          ref={cursorRefCallback}
        />
      </div>}
    </div>
  );
});
