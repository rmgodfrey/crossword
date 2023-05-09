import { handleClick } from './helpers/Controls/index';
import './styles/Controls.css';

const targets = [
  { text: 'letter', className: 'letter', targetMode: 'letter' },
  { text: 'grid', className: 'grid', targetMode: 'grid' },
];
const instructions = [
  { text: 'Check', instructionMode: 'check' },
  { text: 'Reveal', instructionMode: 'reveal' },
];

function Controls(props) {
  return (
    <div className="Controls__wrapper">
      {instructions.map((instruction, i) => (
        <ul key={i} className="Controls">
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
                  Controls__control--${target.className}
                `}
              >
                {instruction.text} {target.text}
              </button>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

export default Controls;
