import getLength from './getLength';
import getCell from './getCell';

export default function getCurrentFragment(
  clueFragments,
  cellNumber,
  clueNumber,
  props,
) {
  return clueFragments.findIndex(
    clueFragment => (
      containsCell(clueFragment, cellNumber, props)
      && clueFragment.clueId === clueNumber
    )
  );
}

function containsCell(clueFragment, cellNumber, props) {
  const gridWidth = props.gridDimensions.gridWidth;
  const axis = clueFragment.direction;
  const start = clueFragment.start;
  if (axis === 'down' && cellNumber % gridWidth !== start % gridWidth) {
    return false;
  }
  const clueFragmentLength = getLength(clueFragment.answer);
  const end = getCell(start, axis, 'forwards', clueFragmentLength - 1, props);
  return cellNumber >= start && cellNumber <= end;
}
