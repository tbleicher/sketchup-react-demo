import React, { Component } from 'react';

import SimpleInput from './SimpleInput';

import './ColorDetailsForm.css';

const attributes = ['name', 'display_name', 'color', 'alpha', 'texture'];
const emptyMaterial = {
  name: '',
  display_name: '',
  color: '',
  alpha: '',
  texture: ''
};

function hasChanges(props, state) {
  const changed = attributes.map(a => props[a] !== state[a]).some(e => e);

  return changed;
}

class ColorDetailsForm extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, props.material);

    this.updateState = this.updateState.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(Object.assign({}, emptyMaterial, nextProps.material));
  }

  updateState(id) {
    const value = document.getElementById(id).value;
    const newState = {};
    newState[id] = value;

    this.setState(newState);
  }

  render() {
    const inputs = attributes.map(attr => {
      return (
        <span key={attr}>
          <label htmlFor={attr}>
            {attr}
          </label>
          <SimpleInput
            id={attr}
            value={this.state[attr]}
            onChange={() => this.updateState(attr)}
          />
        </span>
      );
    });

    return (
      <div id="color_details">
        <h4>Color Details</h4>
        <form onSubmit={evt => this.props.onApply(evt, this.state)}>
          {inputs}
          <input
            type="submit"
            value="Apply"
            disabled={!hasChanges(this.props.material, this.state)}
          />
        </form>
      </div>
    );
  }
}

export default ColorDetailsForm;
