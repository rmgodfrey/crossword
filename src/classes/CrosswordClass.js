import ClueGroup from './ClueGroupClass';
import Cell from './CellClass';

import {
  createInstances,
  iterateOver,
} from '../helpers/index';

export default class Crossword {
  orientations = ['across', 'down'];

  constructor({ gridWidth, clueGroups }) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridWidth;
    this.clueGroups = createInstances(ClueGroup, clueGroups, this);
    this[Symbol.iterator] = iterateOver(this.clueGroups);
    this.clueGroupsByOrientation = this.#buildClueGroupsByOrientation();
    this.cells = this.#createCells();
  }

  sortedClues({
    clueGroupSubset = this.clueGroups,
    partitionByOrientation = true,
  } = {}) {
    return ClueGroup.sortedClues(clueGroupSubset, { partitionByOrientation });
  }

  step(n, orientation) {
    if (orientation === 'across') {
      return n;
    } else if (orientation === 'down') {
      return this.gridWidth * n;
    } else {
      throw new Error('`orientation` must be either "across" or "down"');
    }
  }

  dimensionLengthInCells(orientation) {
    switch (orientation) {
      case 'across': return this.gridWidth;
      case 'down': return this.gridHeight;
      default: throw new Error(
        '`orientation` must be either "across" or "down"'
      );
    }
  }

  extremeCell(orientation, edge) {
    const dimensionLength = this.dimensionLengthInCells(orientation);
    switch (edge) {
      case 'start': return 0;
      case 'end': return dimensionLength - 1;
      default: throw new Error('`edge` must be either "start" or "end"');
    }
  }

  getCell(originalCell, orientation, direction, magnitude) {
    const transform = {
      forwards: n => n,
      backwards: n => -n
    }[direction];

    const otherOrientation = {
      across: 'down',
      down: 'across',
    }[orientation];

    let nextCell = this.cells[
      originalCell.number
      + transform(this.step(magnitude, orientation))
    ];
    if (!this.cells.some(cell => cell === nextCell) || (
      originalCell.position(otherOrientation)
      !== nextCell.position(otherOrientation)
    )) {
      nextCell = null;
    }
    return nextCell;
  }

  *getCellNumbers() {
    for (const clueGroup of this) {
      for (const cellNumber of clueGroup.getCellNumbers()) yield cellNumber;
    }
  }

  #buildClueGroups(orientation) {
    return this.clueGroups.filter(
      element => element.orientation === orientation
    );
  }

  #buildClueGroupsByOrientation() {
    const clueGroupsByOrientation = new Map();
    this.orientations.forEach(orientation => {
      clueGroupsByOrientation.set(
        orientation,
        this.#buildClueGroups(orientation),
      );
    });
    return clueGroupsByOrientation;
  }

  #createCells() {
    const cells = [];
    for (const cellNumber of this.getCellNumbers()) {
      cells[cellNumber] ??= new Cell(cellNumber, this);
    }
    return cells;
  }
}
