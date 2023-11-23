import {
  mod,
  removeNonAlphabetic,
} from '../helpers/index';

export default class Clue {
  constructor({ start, answer }, clueGroup) {
    this.startNumber = start;
    this.clueGroup = clueGroup;
    this.answer = answer;
  }

  isFirstClueOfGroup() {
    return this === this.clueGroup.sortedClues[0]
  }

  containsCell(cell) {
    for (const clueCell of this) {
      if (clueCell === cell) return true;
    }
    return false;
  }

  letterAtCell(cell) {
    const offset = Array.from(this).findIndex(clueCell => clueCell === cell);
    return this.answerLettersOnly[offset];
  }

  get answerLettersOnly() {
    return removeNonAlphabetic(this.answer);
  }

  get startCell() {
    return this.crossword.cells[this.startNumber];
  }

  get crossword() {
    return this.clueGroup.crossword;
  }

  get orientation() {
    return this.clueGroup.orientation;
  }

  get text() {
    const clueGroup = this.clueGroup;
    const firstClue = clueGroup.sortedClues[0];
    if (this === firstClue) {
      return clueGroup.text;
    } else {
      return `See ${firstClue.number}`
    }
  }

  get number() {
    const clueGroup = this.clueGroup;
    const i = clueGroup.sortedClues.indexOf(this);
    return clueGroup.clueNumbers[i];
  }

  nextClue(direction) {
    const clues = this.crossword.sortedClues();
    const i = clues.indexOf(this);
    const n = {
      'forwards': 1,
      'backwards': -1,
    }[direction];
    return clues[mod(i + n, clues.length)];
  }

  *getCells() {
    for (const number of this.getCellNumbers()) {
      yield this.crossword.cells[number];
    }
  }

  *getCellNumbers() {
    const answerLength = this.answerLettersOnly.length;
    for (let i = 0; i < answerLength; i++) {
      yield (this.startNumber + this.crossword.step(i, this.orientation));
    }
  }

  [Symbol.iterator]() {
    return this.getCells();
  }
}
