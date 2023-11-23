import Clue from './Clue.js';

export default function StandaloneClue({
  clueGroup,
  ...props
}) {
  const clue = clueGroup.sortedClues[0];
  return (
    <Clue
      {...props}
      clue={clue}
      type="standalone"
      isSelected={false}
    />
  );
}
