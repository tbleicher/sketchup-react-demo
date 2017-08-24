import React, { Component } from 'react';

import ColorDetailsForm from './components/ColorDetailsForm';
import ColorList from './components/ColorList';

import logo from './logo.svg';
import './App.css';

//declare 'sketchup' object as global to stop ESLint errors
/*global sketchup*/

// eslint-disable-next-line
function sketchupAction(evt, state) {
  evt.preventDefault();
  try {
    sketchup.su_action('Hello World', 42);
  } catch (e) {
    console.log(`Error: ${e.message}`);
    console.log('state:', JSON.stringify(state, null, 2));
  }
}

const emptyMaterial = {
  name: '',
  color: '', 
  texture: '', 
  transparency: ''
};

const testMaterials = {
  'Material1': {
    name: 'Material1',
    color: '#ffffff',
    texture: '',
    transparency: 1.0
  },
  'some name': Object.assign({}, emptyMaterial, { name: 'some name' }),
  'one': Object.assign({}, emptyMaterial, { name: 'one' }),
  'two': Object.assign({}, emptyMaterial, { name: 'two' }),
  'three': Object.assign({}, emptyMaterial, { name: 'three' })
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      materials: testMaterials,
      selected: 'Material1'
    };

    this.selectMaterial = this.selectMaterial.bind(this);
    this.updateMaterial = this.updateMaterial.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  selectMaterial(name) {
    this.setState({ selected: name });
  }

  updateMaterial(evt, mat) {
    evt.preventDefault();
  }

  updateState(id) {
    const value = document.getElementById(id).value;
    const newState = {};
    newState[id] = value;

    this.setState(newState);
  }

  render() {
    const currentMaterial = this.state.materials[this.state.selected] || {};
    const materials = Object.keys(this.state.materials);

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React Color Manager</h2>
        </div>

        <div className="App-body">
          <ColorList
            materials={materials}
            onSelect={this.selectMaterial}
            selected={this.state.selected}
          />
          <ColorDetailsForm
            material={currentMaterial}
            onApply={this.updateState}
          />
        </div>
      </div>
    );
  }
}

export default App;
