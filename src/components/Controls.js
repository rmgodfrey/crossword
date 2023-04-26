import { handleClick } from './helpers/Controls/index';

function Controls({
  ...props
}) {
  return (
    <ul>
      <li>
        <button onClick={() => handleClick({
          instruction: 'check',
          target: 'letter',
          ...props,
        })}>
          Check letter
        </button>
      </li>
      <li>
        <button onClick={() => handleClick({
          instruction: 'check',
          target: 'grid',
          ...props,
        })}>
          Check grid
        </button>
      </li>
      <li>
        <button onClick={() => handleClick({
          instruction: 'reveal',
          target: 'letter',
          ...props,
        })}>
          Reveal letter
        </button>
      </li>
      <li>
        <button onClick={() => handleClick({
          instruction: 'reveal',
          target: 'grid',
          ...props,
        })}>
          Reveal grid
        </button>
      </li>
    </ul>
  )
}

export default Controls;
