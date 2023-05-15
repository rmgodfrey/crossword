import { handleClick } from './helpers/Controls/index';
import './styles/Controls.css';

const targets = [
  { text: 'letter', targetMode: 'letter' },
  { text: 'word', targetMode: 'word' },
  { text: 'grid', targetMode: 'grid' },
];
const instructions = [
  { text: 'Check', className: 'check', instructionMode: 'check' },
  { text: 'Reveal', className: 'reveal', instructionMode: 'reveal' },
  { text: 'Clear', className: 'clear', instructionMode: 'clear' },
];

function Controls(props) {
  return (
    <div className="Controls__wrapper">
      {instructions.map((instruction, i) => (
        <div key={i} className={`
          Controls__instruction-wrapper
          Controls__instruction-wrapper--${instruction.className}
        `}>
          <p className="Controls__instruction">
            <strong>{instruction.text}</strong>
          </p>
          <ul className="Controls">
            {targets.map((target, i) => (
              <li key={i}>
                <button
                  onClick={() => handleClick({
                    instruction: instruction.instructionMode,
                    target: target.targetMode,
                    ...props,
                  })}
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

export default Controls;
