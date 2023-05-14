export default function getCell(
  currentCell,
  axis,         // 'across' or 'down'
  direction,    // 'forwards' or 'backwards'
  distance,
  {
    cells,
    gridDimensions: { gridWidth, gridHeight }
  },
) {
  const [step, magnitude, axisLength] = (
    axis === 'across'
    ? [1, currentCell % gridWidth, gridWidth]
    : [gridWidth, Math.floor(currentCell / gridWidth), gridHeight]
  );
  const [multiplier, isOutOfBounds] = (
    direction === 'forwards'
    ? [distance, magnitude + distance > axisLength - 1]
    : [-distance, magnitude - distance < 0]
  );
  const newCell = currentCell + step * multiplier;
  if (isOutOfBounds) return null;
  return (newCell in cells) ? newCell : null;
}
