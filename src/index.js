import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Crossword from './components/Crossword';
import clues from './data/clues.json';
import reportWebVitals from './reportWebVitals';

// clueGroups.sort((a, b) => {
//   if (a.direction === 'across' && b.direction === 'down') return -1;
//   if (a.direction === 'down' && b.direction === 'across') return 1;
//   return a.fragments[0].start - b.fragments[0].start;
// });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Crossword
      clues={clues}
      gridWidth={15}
    />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
