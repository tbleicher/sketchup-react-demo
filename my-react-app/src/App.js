import React, { Component } from 'react';

import ColorDetailsForm from './components/ColorDetailsForm';
import ColorList from './components/ColorList';

import logo from './logo.svg';
import './App.css';

//declare 'sketchup' object as global to stop ESLint errors
/*global sketchup*/

// eslint-disable-next-line
function sketchupAction(state) {
  // evt.preventDefault();
  console.log('state:', JSON.stringify(state, null, 2));
  try {
    sketchup.su_action(state);
  } catch (e) {
    if (e.message !== 'sketchup is not defined') {
      console.error(e);
    }
  }
}

function mergeProps(state, newState) {
  return Object.assign({}, state, newState);
}


const emptyMaterial = {
  name: '',
  color: '', 
  texture: '', 
  transparency: ''
};

const testMaterials = {} 
'one two three four five six seven eight nine ten a11 b12 c13 d14 e15 f16 g17'
.split(' ')
.forEach(s => {
  testMaterials[s] = Object.assign({}, emptyMaterial, { name: s });
});

testMaterials['Material1'] = {
  name: 'Material1',
  color: '#ffffff',
  texture: '',
  transparency: 1.0
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
    //this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
  }
  
  componentDidMount() {
    console.log('componentDidMount');
  }

  componentWillReceiveProps(nextProps={}) {
    console.log("App.willReceiveProps", nextProps.store);
    this.setState(mergeProps(this.state, nextProps.store || {}));

  }

  selectMaterial(name) {
    console.log(`selectMaterial(${name})`);
    this.setState({ selected: name });
    sketchupAction({ selected: name });
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
    const materials = Object.keys(this.state.materials).sort();

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
        <div className="App-footer">
          {navigator.userAgent}
        </div>
      </div>
    );
  }
}

export default App;
