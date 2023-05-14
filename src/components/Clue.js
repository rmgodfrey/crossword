import './styles/Clue.css';

export default function Clue({ clueFragment }) {
  return (
    <>
      <span className={'Clue__clue-number'}>
        {clueFragment.clueNumbers.join()}
      </span>
      {' '}
      {clueFragment.clueText}
    </>
  );
}
