import Crossword from './Crossword';
import Heading from './Heading';
import './styles/App.css';

const headingLevel = 1;

export default function App({ crossword }) {
  return (
    <div className="App">
      <Heading
        className="App__heading"
        headingLevel={headingLevel}
      >
        Rossword
      </Heading>
      <Crossword
        crossword={crossword}
        headingLevel={headingLevel + 1}
      />
    </div>
  );
}
