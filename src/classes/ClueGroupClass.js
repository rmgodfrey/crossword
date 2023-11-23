import Clue from './ClueClass';
import { isAlphabetic, iterateOver } from '../helpers/index'

import {
  createInstances,
  prioritize,
} from '../helpers/index';

let id = 1;

export default class ClueGroup {
  constructor({ orientation, text, clues }, crossword) {
    this.orientation = orientation;
    this.text = text;
    this.clues = createInstances(Clue, clues, this);
    this[Symbol.iterator] = iterateOver(this.clues);
    this.crossword = crossword;
    this.id = id++;
  }

  // Given `clueGroups` (either a set of clue groups or a single clue group),
  // returns the clues of `clueGroupSource`, sorted in proper crossword order.
  // If `partitionByOrientation` is set to true, then all across clues will be
  // sorted before all down clues. If false, then the clues will be sorted
  // purely by clue number, so that 7 down is sorted before 8 across.
  static sortedClues(clueGroups, { partitionByOrientation = true } = {}) {
    let result;
    if ('clues' in clueGroups) {
      result = Array.from(clueGroups.clues);
    } else {
      result = Array.from(clueGroups)
        .flatMap(clueGroup => Array.from(clueGroup.clues))
        .sort((a, b) => a.startNumber - b.startNumber);
    }
    if (partitionByOrientation) {
      result.sort(prioritize(clue => clue.orientation === 'across'));
    }
    return result;
  }

  get sortedClues() {
    return ClueGroup.sortedClues(this);
  }

  get clueNumbers() {
    const result = [];
    const sortedCrosswordClues = this.crossword.sortedClues({
      partitionByOrientation: false,
    });
    let clueNumber = 0;
    let cellNumber = 0;
    for (const clue of sortedCrosswordClues) {
      if (clue.startNumber > cellNumber) clueNumber++;
      if (this.clues.has(clue)) result.push(clueNumber);
      cellNumber = clue.startNumber;
    }
    return result;
  }

  get answer() {
    let answer = '';
    for (const clue of this) {
      answer += clue.answer;
    }
    return answer.replaceAll(/([^a-z])\1*/ig, (_, p1) => p1);
  }

  containsCell(cell) {
    for (const currentCell of this.getCells()) {
      if (currentCell === cell) return true;
    }
    return false;
  }

  clueAtCell(cell) {
    for (const clue of this) {
      for (const currentCell of clue) {
        if (currentCell === cell) return clue;
      }
    }
    throw new Error('Cell not found in clue group.');
  }

  get numberOfLetters() {
    let clueLengths = [];
    let clueLength = 0;
    for (const clue of this) {
      for (const char of clue.answer) {
        if (isAlphabetic(char)) {
          clueLength++;
        } else {
          clueLengths.push(clueLength);
          clueLengths.push(char === ' ' ? ',' : char);
          clueLength = 0;
        }
      }
    }
    clueLengths.push(clueLength);
    return `(${clueLengths.join('')})`;
  }

  *getCellNumbers() {
    for (const clue of this) {
      for (const cellNumber of clue.getCellNumbers()) yield cellNumber;
    }
  }

  *getCells() {
    for (const cellNumber of this.getCellNumbers()) {
      yield this.crossword.cells[cellNumber];
    }
  }
}
