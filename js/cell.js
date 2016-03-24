/**
 * Created by Ruslan on 23-Mar-16.
 */
'use strict';

class Cell {
  constructor(val, isWall) {
    this.marked = false;
    this.wall = isWall || false;
    this.value = val || null;
  }
}
