/**
 * Created by Ruslan on 04-Mar-16.
 */
'use strict';

class Maze extends Component {
  constructor(options) {
    super(options);
    this._height = options.height;
    this._width = options.width;
    this._map = [];
    this._start = [1, 1];
    this._finish = [this._height - 2, this._width - 2];
    this._cellSize = options.cellSize;
    this._path = [];
    this._inputState = 'wall';
    this._context = null;

    this._createEmptyMap();

    if (this._el) {
      this.generate(0.0);
      this.waveAlgorithm();
      this.findPath();
      this.initialiseCanvas();
      this.drawMap();
      this.drawPath();
    }
  }

  getPath() {
    return this._path;
  }

  getCellSize() {
    return this._cellSize;
  }

  getHeight() {
    return this._height;
  }

  getWidth() {
    return this._width;
  }

  setCellSize(value) {
    this._cellSize = +value;
  }

  setWalls(walls) {
    let i, j;

    for (let k = 0; k < walls.length; k++) {
      i = walls[k][0];
      j = walls[k][1];

      if (i >= this._height || j >= this._width)
        throw new Error('Cant create Wall out of map size.');

      this._map[i][j].wall = true;
    }
  }

  setStart(value) {
    let i = value[0];
    let j = value[1];

    if (i >= this._height || j >= this._width) {
      console.log('Cant create Start out of this._map size.');
      return 'fail';
    }

    if (this._map[i][j].wall) {
      console.log('Cant create Start at wall cell');
      return 'fail';
    }

    this._start = value;

    if (this._el)
      this.drawMap();

    return 'ok';
  }

  setFinish(value) {
    let i = value[0];
    let j = value[1];

    if (i >= this._height || j >= this._width) {
      console.log('Cant create Finish out of this._map size.');
      return 'fail';
    }

    if (this._map[i][j].wall) {
      console.log('Cant create Finish at wall cell');
      return 'fail';
    }

    this._finish = value;

    if (this._el)
      this.drawMap();

    return 'ok';
  }

  setInputState(value) {
    this._inputState = value;
  }

  waveAlgorithm() {
    let allMarked = false;
    let currStep = 0;
    let map = this._map;

    this._clearMap();

    map[this._start[0]][this._start[1]].value = 0;

    while (!allMarked) {
      allMarked = true;
      for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
          if (this._isFinish(i, j) && this._map[i][j].marked) {
            return 'success';
          }

          if (!map[i][j].wall && map[i][j].value == currStep) {
            allMarked = this._markMates([i, j], currStep + 1, allMarked);
          }
        }
      }
      currStep++;
    }

    return 'fail';
  }

  findPath() {
    let i = this._finish[0];
    let j = this._finish[1];
    let finishValue = this._map[i][j].value;

    this._path = [];

    if (!this._map[this._finish[0]][this._finish[1]].marked)
      return 'fail';

    this._path.unshift(this._finish);

    for (let k = finishValue; k >= 0; k--) {
      if (this._map[i][j - 1] &&
        this._map[i][j - 1].value == this._map[i][j].value - 1) {
        this._path.unshift([i, j - 1]);
        j--;
      } //left cell

      if (this._map[i - 1] &&
        this._map[i - 1][j].value == this._map[i][j].value - 1) {
        this._path.unshift([i - 1, j]);
        i--;
      } //top cell

      if (this._map[i][j + 1] &&
        this._map[i][j + 1].value == this._map[i][j].value - 1) {
        this._path.unshift([i, j + 1]);
        j++;
      } //right cell

      if (this._map[i + 1] &&
        this._map[i + 1][j].value == this._map[i][j].value - 1) {
        this._path.unshift([i + 1, j]);
        i++;
      } //bottom cell
    }

    this._path.unshift(this._start);
    console.log(this._path);
  }

  drawMap() {
    let ctx = this._context;

    this._el.width = this._cellSize * this._width;
    this._el.height = this._cellSize * this._height;

    ctx.fillStyle = 'rgb(245,224,193)';
    ctx.fillRect(0, 0, this._el.width, this._el.height);

    ctx.strokeStyle = 'rgb(148,132,134)';
    ctx.lineWidth = 1;
    let currX = 0, currY = 0;

    ctx.fillStyle = 'rgb(75,92,143)';
    ctx.font = this._cellSize / 2 + 'px Arial';
    ctx.textAlign = 'center';

    for (let i = 0; i < this._height; i++) {
      currX = 0;
      for (let j = 0; j < this._width; j++) {
        ctx.strokeRect(currX, currY, this._cellSize, this._cellSize);

        if (this._map[i][j].wall)
          ctx.fillRect(currX, currY, this._cellSize, this._cellSize);

        if (i == this._start[0] && j == this._start[1]) {
          ctx.fillText('S', currX + this._cellSize / 5, currY + this._cellSize / 2);
        }

        if (i == this._finish[0] && j == this._finish[1]) {
          ctx.fillText('F', currX + this._cellSize / 5, currY + this._cellSize / 2);
        }

        currX += this._cellSize;
      }
      currY += this._cellSize;
    }
  }

  drawPath() {
    let ctx = this._context;
    let toX = this._path[0][1] * this._cellSize + this._cellSize / 2;
    let toY = this._path[0][0] * this._cellSize + this._cellSize / 2;

    ctx.strokeStyle = 'rgb(102,47,62)';
    ctx.lineWidth = this._cellSize / 6;
    ctx.beginPath();
    ctx.moveTo(toX, toY);

    for (let i = 1; i < this._path.length; i++) {
      toX = this._path[i][1] * this._cellSize + this._cellSize / 2;
      toY = this._path[i][0] * this._cellSize + this._cellSize / 2;

      ctx.lineTo(toX, toY);
    }

    ctx.stroke();
  }

  toString() {
    let str = '';

    for (let i in this._map) {
      for (let j in this._map[i]) {
        if (this._map[i][j].wall) {
          str += 'w,\t';
          continue;
        }

        if (i == this._start[0] && j == this._start[1]) {
          str += 's,\t';
          continue;
        }

        if (i == this._finish[0] && j == this._finish[1]) {
          str += 'f,\t';
          continue;
        }

        if (this._map[i][j].value) {
          str += +this._map[i][j].value + ',\t';
        } else {
          str += ',\t';
        }
      }
      str += '\n';
    }
    return str;
  }

  generate(variety) {
    let currCell = [1, 1];
    let brakedPath = [];
    let lastCell;
    let randX, randY;

    this._clearMap();
    this._clearWalls();

    for (let i = 0; i < this._height; i++) {
      for (let j = 0; j < this._width; j++) {
        if (!(i % 2 != 0 && j % 2 != 0)){
          this._map[i][j].wall = true;
        }
      }
    }

    do {
      brakedPath = brakedPath.concat(this._brakeWalls(currCell));
      while (brakedPath.length > 0) {
        lastCell = [brakedPath[brakedPath.length - 1][0], brakedPath[brakedPath.length - 1][1]];
        if (this._getMatesTrowWall(lastCell).length > 0) {
          currCell = [lastCell[0], lastCell[1]];
          break;
        } else {
          brakedPath.pop();
        }
      }
    } while (brakedPath.length > 0); // here we got perfect maze

    //for more this._path variety we breaking some random walls
    if (variety) {
      for (let i = 0; i < variety * this._height * this._width; i++) {
        randX = Math.round(Math.random() * (this._width - 1));
        randY = Math.round(Math.random() * (this._height - 1));
        this._map[randY][randX].wall = false;
      }
    }

  }

  initialiseCanvas() {
    this._context = this._el.getContext('2d');

    this._el.addEventListener('click', this._canvasOnClick.bind(this));
  }

  _canvasOnClick(event) {

    let x = (event.pageX - this._el.offsetLeft) / this._cellSize | 0;
    let y = (event.pageY - this._el.offsetTop) / this._cellSize | 0;

    switch (this._inputState) {
      case 'wall':
        this._flipWall(x, y);
        this._clearMap();
        this.drawMap();
        break;
      case 'start':
        if (this.setStart([y, x]) == 'ok')
          this.setInputState('wall');
        break;
      case 'finish':
        if (this.setFinish([y, x]) == 'ok')
          this.setInputState('wall');
        break;
    }

    console.log('Clicked [' + x + ', ' + y + ']');
  }

  _flipWall(x, y) {
    if ((this._start[1] == x && this._start[0] == y ) ||
      (this._finish[1] == x && this._finish[0] == y)) {
      console.log('Cant create wall on this._start or this._finish cell.');
      return;
    }
    this._map[y][x].wall = !this._map[y][x].wall;
  }

  _clearMap() {
    for (let i = 0; i < this._height; i++) {
      for (let j = 0; j < this._width; j++) {
        this._map[i][j].value = null;
        this._map[i][j].marked = false;
      }
    }
  }

  _clearWalls() {
    for (let i = 0; i < this._height; i++) {
      for (let j = 0; j < this._width; j++) {
        this._map[i][j].wall = false;
      }
    }
  }

  _getMatesTrowWall(cell) {
    let mates = [];
    let i = cell[0];
    let j = cell[1];

    if (this._map[i][j - 2] && !this._map[i][j - 2].wall && !this._map[i][j - 2].marked) {
      mates.push('left');
    }// left mate

    if (this._map[i - 2] && !this._map[i - 2][j].wall && !this._map[i - 2][j].marked) {
      mates.push('top');
    } // top mate

    if (this._map[i][j + 2] && !this._map[i][j + 2].wall && !this._map[i][j + 2].marked) {
      mates.push('right');
    } // right mate

    if (this._map[i + 2] && !this._map[i + 2][j].wall && !this._map[i + 2][j].marked) {
      mates.push('bottom');
    } // bottom mate

    return mates;

  }

  _markMates(cell, value, allMarked) {

    let map = this._map;
    let i = cell[0];
    let j = cell[1];

    if (map[i][j - 1] && !map[i][j - 1].marked && !map[i][j - 1].wall) {
      this._map[i][j - 1].value = value;
      this._map[i][j - 1].marked = true;
      allMarked = false;
    } //left cell

    if (map[i - 1] && !map[i - 1][j].marked && !map[i - 1][j].wall) {
      this._map[i - 1][j].value = value;
      this._map[i - 1][j].marked = true;
      allMarked = false;
    } //top cell

    if (map[i][j + 1] && !map[i][j + 1].marked && !map[i][j + 1].wall) {
      this._map[i][j + 1].value = value;
      this._map[i][j + 1].marked = true;
      allMarked = false;
    } //right cell

    if (map[i + 1] && !map[i + 1][j].marked && !map[i + 1][j].wall) {
      this._map[i + 1][j].value = value;
      this._map[i + 1][j].marked = true;
      allMarked = false;
    } //bottom cell


    return allMarked;
  }

  _brakeWalls(currCell) {
    let i = currCell[0];
    let j = currCell[1];
    let mates;
    let rand;
    let stack = [];
    let map = this._map;

    while (true) {
      mates = this._getMatesTrowWall([i, j]);
      rand = Math.round(Math.random() * 10) % mates.length;

      if (mates.length == 0) {
        this._map[i][j].marked = true;
        break;
      }
      stack.push([i, j]);

      switch (mates[rand]) {
        case 'left':
          map[i][j].marked = true;
          map[i][j - 1].marked = true;
          map[i][j - 1].wall = false;
          j = j - 2;
          break;
        case 'top':
          map[i][j].marked = true;
          map[i - 1][j].marked = true;
          map[i - 1][j].wall = false;
          i = i - 2;
          break;
        case 'right':
          map[i][j].marked = true;
          map[i][j + 1].marked = true;
          map[i][j + 1].wall = false;
          j = j + 2;
          break;
        case 'bottom':
          map[i][j].marked = true;
          map[i + 1][j].marked = true;
          map[i + 1][j].wall = false;
          i = i + 2;
          break;
      }
    }
    return stack;
  }

  _createEmptyMap() {
    for (let i = 0; i < this._height; i++) {
      this._map[i] = [];
      for (let j = 0; j < this._width; j++) {
        this._map[i][j] = new Cell();
      }
    }
  }

  _isFinish(i, j) {
    if (i == this._finish[0] && j == this._finish[1]) {
      return true;
    }
  }

}






