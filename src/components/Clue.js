import './styles/Clue.css';
import getClueLength from './helpers/getClueLength';
import isClueFinished from './helpers/isClueFinished';

export default function Clue({ cells, clues, clueFragment, cellText }) {
  const clue = clues[clueFragment.clueId];
  return (
    <span className={
      isClueFinished(clueFragment.clueId, cells, cellText)
      ? 'Clue__finished'
      : undefined
    }>
      <span className={'Clue__clue-number'}>
        {clueFragment.clueNumbers.join()}
      </span>
      {' '}
      {clueFragment.clueText}
      {' '}
      {
        (clueFragment.start === clue.fragments[0].start)
        && `(${getClueLength(clue)})`
      }
    </span>
  );
}
