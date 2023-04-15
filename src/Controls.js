function Controls({
  onClick,
}) {
  return (
    <ul>
      <li>
        <button onClick={() => onClick('check', 'letter')}>
          Check letter
        </button>
      </li>
      <li>
        <button onClick={() => onClick('check', 'grid')}>
          Check grid
        </button>
      </li>
      <li>
        <button onClick={() => onClick('reveal', 'letter')}>
          Reveal letter
        </button>
      </li>
      <li>
        <button onClick={() => onClick('reveal', 'grid')}>
          Reveal grid
        </button>
      </li>
    </ul>
  )
}

export default Controls;
