import './styles/Controls.css';

const targets = [
  { text: 'letter', targetMode: 'cell' },
  { text: 'word', targetMode: 'clueGroup' },
  { text: 'grid', targetMode: 'crossword' },
];
const instructions = [
  { text: 'Check', className: 'check', instructionMode: 'check' },
  { text: 'Reveal', className: 'reveal', instructionMode: 'reveal' },
  { text: 'Clear', className: 'clear', instructionMode: 'clear' },
];

export default function Controls({
  onClick,
}) {
  return (
    <div className="Controls__wrapper">
      {instructions.map((instruction, i) => (
        <div key={i} className={`
          Controls__instruction-wrapper
          Controls__instruction-wrapper--${instruction.className}
        `}>
          <p className="Controls__instruction">
            <strong>{instruction.text}:</strong>
          </p>
          <ul className="Controls">
            {targets.map((target, i) => (
              <li key={i}>
                <button
                  onClick={() => onClick(
                    instruction.instructionMode,
                    target.targetMode,
                  )}
                  className={`
                    Controls__control
                  `}
                >
                  {target.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
