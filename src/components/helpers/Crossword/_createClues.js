function getClueFragments(clues) {
  const clueFragments = [];
  clues.forEach((clue, index) => {
    clue.fragments.forEach((fragment) => {
      clueFragments.push({ ...fragment, clueId: index });
    });
  });
  return clueFragments.sort((a, b) => a.start - b.start);
}

function partition(iterable, testFn) {
  const result = [[], []];
  for (const item of iterable) {
    if (testFn(item)) {
      result[0].push(item);
    } else {
      result[1].push(item);
    }
  }
  return result;
}

export default function createClues(clues) {
  const clueFragments = getClueFragments(clues);
  let clueNumber = 1;
  const encounteredClues = [];
  clueFragments.forEach((clueFragment) => {
    if (
      encounteredClues.length
      && clueFragment.start > encounteredClues.at(-1).start
    ) {
      clueNumber++;
    }
    let clueText = clues[clueFragment.clueId].text;
    const firstFragmentFromSameWord = encounteredClues.find(
      clue => clue.clueId === clueFragment.clueId
    );
    if (firstFragmentFromSameWord) {
      firstFragmentFromSameWord.clueNumbers.push(clueNumber);
      const firstClueNumber = firstFragmentFromSameWord.clueNumbers[0];
      clueText = `See ${firstClueNumber}`;
    }
    encounteredClues.push({
      direction: clues[clueFragment.clueId].direction,
      start: clueFragment.start,
      clueId: clueFragment.clueId,
      clueNumbers: [clueNumber],
      answer: clueFragment.answer,
      clueText,
    });
  });
  return partition(encounteredClues, clue => clue.direction === 'across');
}
