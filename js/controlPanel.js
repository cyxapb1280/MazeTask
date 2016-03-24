/**
 * Created by Ruslan on 23-Mar-16.
 */
'use strict';
class ControlPanel extends Component {
  constructor(options) {
    super(options);

    this._el.addEventListener('click', this._onGenerateClick.bind(this));
    this._el.addEventListener('click', this._onSetStartClick.bind(this));
    this._el.addEventListener('click', this._onSetFinishClick.bind(this));
    this._el.addEventListener('click', this._onFindPathClick.bind(this));
    this._el.addEventListener('change', this._onCellSizeSelectChange.bind(this));
    this._el.addEventListener('change', this._onHeightInputChange.bind(this));
    this._el.addEventListener('change', this._onWidthInputChange.bind(this));
  }

  _onGenerateClick(event) {
    let generateButton = event.target.closest('[data-selector="generate-button"]');
    let varietyInput = this._el.querySelector('[data-selector="variety-input"]');

    if (!generateButton || !varietyInput) {
      return;
    }

    this._trigger('generate', varietyInput.value);
  }

  _onSetStartClick(event) {
    let setStartButton = event.target.closest('[data-selector="set-start-button"]');

    if (!setStartButton) {
      return;
    }

    this._trigger('setStart');
  }

  _onSetFinishClick(event) {
    let setFinishButton = event.target.closest('[data-selector="set-finish-button"]');

    if (!setFinishButton) {
      return;
    }

    this._trigger('setFinish');
  }

  _onFindPathClick(event) {
    let findPathButton = event.target.closest('[data-selector="find-path-button"]');

    if (!findPathButton) {
      return;
    }

    this._trigger('findPath');
  }

  _onCellSizeSelectChange(event) {
    let cellSizeSelect = event.target.closest('[data-selector="cell-size-select"]');

    if (!cellSizeSelect) {
      return;
    }

    this._trigger('cellSizeChange', cellSizeSelect.value);
  }

  _onHeightInputChange(event) {
    let heightInput = event.target.closest('[data-selector="height-input"]');

    if (!heightInput) {
      return;
    }

    this._trigger('heightChange', heightInput.value);
  }

  _onWidthInputChange(event) {
    let widthInput = event.target.closest('[data-selector="width-input"]');

    if (!widthInput) {
      return;
    }

    this._trigger('widthChange', widthInput.value);
  }

}