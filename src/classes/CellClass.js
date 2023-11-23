import { prioritize } from '../helpers/index';

export default class Cell {
  constructor(number, crossword) {
    this.number = number;
    this.crossword = crossword;
    this.column = number % crossword.gridWidth;
    this.row = Math.floor(number / crossword.gridWidth);
  }

  *clueGroups() {
    for (const clueGroup of this.crossword.clueGroups) {
      if (clueGroup.containsCell(this)) yield clueGroup;
    }
  }

  get answer() {
    const clueGroup = this.clueGroups().next().value;
    for (const clue of clueGroup) {
      if (clue.containsCell(this)) {
        return clue.letterAtCell(this);
      }
    }
    return undefined;
  }

  position(orientation) {
    switch (orientation) {
      case 'across': return this.column;
      case 'down': return this.row;
      default: return undefined;
    }
  }

  sortedClueGroups(preferredOrientation = 'across') {
    const clueGroups = this.crossword.clueGroups.filter(
      clueGroup => clueGroup.containsCell(this)
    );
    return Array.from(clueGroups).sort(prioritize(
      clueGroup => clueGroup.orientation === preferredOrientation
    ));
  }

  // Returns true if cell is at {beginning, end} of a {column, row}, and false
  // otherwise. If `orientation` is 'across', then result is based on column,
  // and if `orientation` is 'down', result is based on row. If `edge` is
  // 'start', then result is based on beginning, and if `edge` is 'end', result
  // is based on end.
  isAtEdgeOfGrid(orientation, edge) {
    const extremeCell = this.crossword.extremeCell(orientation, edge);
    return this.position(orientation) === extremeCell;
  }

  // Given a clue group, returns true if this cell is the start cell of any clue
  // in the clue group. Returns false otherwise.
  beginsClueInGroup(clueGroup) {
    for (const clue of clueGroup) {
      if (clue.startNumber === this.number) return true;
    }
    return false;
  }

  get clueNumber() {
    const cluesBegun = this.#cluesBegun();
    if (cluesBegun.length) {
      return cluesBegun[0].number;
    } else {
      return undefined;
    }
  }

  // Returns an array of clues for which this cell is the initial cell.
  #cluesBegun() {
    const result = [];
    for (const clue of this.crossword.sortedClues()) {
      if (clue.startNumber === this.number) {
        result.push(clue);
      }
    }
    return result;
  }
}
