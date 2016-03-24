/**
 * Created by Ruslan on 23-Mar-16.
 */
'use strict';

class Page {
  constructor(options){
    this._el = options.element;

    this._controlPanel = new ControlPanel({
      element: this._el.querySelector('[data-component="control-panel"]')
    });
    
    this._maze = new Maze({
      element: this._el.querySelector('[data-component="maze-canvas"]'),
      height: 21,
      width: 21,
      cellSize: 32
    });

    this._controlPanel.on('generate', this._onControlPanelGenerate.bind(this));
    this._controlPanel.on('setStart', this._onControlPanelSetStart.bind(this));
    this._controlPanel.on('setFinish', this._onControlPanelSetFinish.bind(this));
    this._controlPanel.on('findPath', this._onControlPanelFindPath.bind(this));
    this._controlPanel.on('cellSizeChange', this._onControlPanelCellSizeChange.bind(this));
    this._controlPanel.on('heightChange', this._onControlPanelHeightChange.bind(this));
    this._controlPanel.on('widthChange', this._onControlPanelWidthChange.bind(this));
  }

  _onControlPanelGenerate(event){
    console.log('generate with variety: ', event.detail);

    var newFinish = [this._maze.getHeight() - 2, this._maze.getWidth() - 2];
    var variety= event.detail;

    //in maze with even sizes algorithm can generate a wall on default finish cell
    if (this._maze.getHeight() % 2 == 0) {
      newFinish[0]++;
    }
    if (this._maze.getWidth() % 2 == 0) {
      newFinish[1]++;
    }

    this._maze.setStart([1, 1]);
    this._maze.setFinish(newFinish);
    this._maze.generate(variety);
    this._maze.drawMap();
    console.log(this._maze.toString());
  }

  _onControlPanelSetStart(event){
    console.log('setStart');

    this._maze.setInputState("start");
  }

  _onControlPanelSetFinish(event){
    console.log('setFinish');

    this._maze.setInputState("finish");
  }

  _onControlPanelFindPath(event){
    console.log('findPath');

    this._maze.waveAlgorithm();
    this._maze.findPath();
    this._maze.drawPath();
    console.log(this._maze.toString())
  }

  _onControlPanelCellSizeChange(event){
    console.log('Cell size:' + event.detail);
    let cellSize = event.detail;
    this._maze.setCellSize(cellSize);
    this._maze.drawMap();
  }

  _onControlPanelHeightChange(event){
    console.log('Height: ' + event.detail);

    let inputHeight = event.detail;

    this._maze = new Maze({
      element: this._maze.getElement(),
      height: inputHeight,
      width: this._maze.getWidth(),
      cellSize: this._maze.getCellSize()
    });
  }

  _onControlPanelWidthChange(event){
    console.log('Width: ' + event.detail);

    let inputWidth = event.detail;

    this._maze = new Maze({
      element: this._maze.getElement(),
      height: this._maze.getHeight(),
      width: inputWidth,
      cellSize: this._maze.getCellSize()
    });
  }
}