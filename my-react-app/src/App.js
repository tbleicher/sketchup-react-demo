import React, { Component } from 'react';

import ColorDetailsForm from './components/ColorDetailsForm';
import ColorList from './components/ColorList';
import ColorDiffList from './components/ColorDiffList';

import logo from './logo.svg';
import './App.css';

//declare 'sketchup' object as global to stop ESLint errors
/*global sketchup*/

function testMaterial(name) {
  const r = parseInt(Math.random() * 256, 10);
  const g = parseInt(Math.random() * 256, 10);
  const b = parseInt(Math.random() * 256, 10);
  return {
    name,
    display_name: name,
    color: `Color(${r}, ${g}, ${b}, 255)`,
    red: r,
    green: g,
    blue: b,
    texture: '',
    alpha: 1.0
  };
}

const testMaterials = {};
'Material1 two M3 four five six seven eight nine ten a11 b12 c13 d14 e15 f16 g17'
  .split(' ')
  .forEach(s => {
    testMaterials[s] = testMaterial(s);
  });

function replace_action(payload) {
  const replace = payload.replace;
  const materials = Object.assign({}, payload.materials);
  delete materials[replace];
  const status = `replaced material ${payload.replace} with ${payload.replace_with}`;
  return { status, materials };
}

function browser_su_action(action) {
  switch (action.action) {
    case 'LOAD_MATERIALS':
      return {
        status: 'loaded materials list',
        materials: testMaterials
      };
    case 'LOAD_THUMBNAIL':
      return {
        status: `loaded thumbnail for material '${action.payload}'`
      };
    case 'LOAD_THUMBNAILS':
      return {
        error: 'loaded all thumbnails'
      };
    case 'REPLACE_MATERIAL':
      return replace_action(action.payload);
    default:
      return {};
  }
}

// eslint-disable-next-line
function sketchupAction(action) {
  // evt.preventDefault();
  console.log('state:', JSON.stringify(action, null, 2));
  try {
    sketchup.su_action(action);
  } catch (e) {
    if (e.message !== 'sketchup is not defined') {
      console.error(e);
    } else {
      const data = browser_su_action(action);
      // eslint-disable-next-line
      global.update_data({ ...data });
    }
  }
}

// replace error, materials and status but update thumbnails
function mergeProps(state, newState = {}) {
  return {
    error: newState.error || '',
    materials: newState.materials || state.materials || {},
    status: newState.status || state.status || '',
    thumbnails: Object.assign({}, state.thumbnails, newState.thumbnails)
  };
}

function formatStatus(error = '', status = '') {
  return error
    ? <span className="error">
        {error}
      </span>
    : status;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      materials: {},
      selected: '',
      status: '',
      thumbnails: {}
    };

    this.replaceMaterial = this.replaceMaterial.bind(this);
    this.selectMaterial = this.selectMaterial.bind(this);
    this.updateMaterial = this.updateMaterial.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  // load materials immediately after app component is created
  componentDidMount() {
    console.log('componentDidMount');
    sketchupAction({ action: 'LOAD_MATERIALS' });
    setTimeout(() => sketchupAction({ action: 'LOAD_THUMBNAILS' }), 2000);
  }

  // update state with new state received via nextProps
  componentWillReceiveProps(nextProps = {}) {
    const merged = mergeProps(this.state, nextProps.data);
    this.setState(merged);
  }

  //
  replaceMaterial(name) {
    if (this.state.selected) {
      console.log(`replaceMaterial(${name})`);
      sketchupAction({
        action: 'REPLACE_MATERIAL',
        payload: {
          replace: name,
          replace_with: this.state.selected,
          // adding materials to simulate update via browser_su_action
          materials: this.state.materials
        }
      });
    }
  }

  selectMaterial(name) {
    console.log(`selectMaterial(${name})`);
    this.setState({ selected: name, status: `selected material ${name}` });
    if (!this.state.thumbnails[name]) {
      sketchupAction({ action: 'LOAD_THUMBNAIL', payload: name });
    }
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
    const statusmsg = formatStatus(this.state.error, this.state.status);

    const list = Object.keys(this.state.materials).length
      ? <ColorList
          title={'Source List'}
          materials={this.state.materials}
          onSelect={this.selectMaterial}
          selected={this.state.selected}
          thumbnail={this.state.thumbnails[this.state.selected]}
        />
      : <span onClick={() => sketchupAction({ action: 'LOAD_MATERIALS' })}>
          load materials
        </span>;

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React Color Manager</h2>
        </div>

        <div className="App-body">
          {list}
          <ColorDiffList
            title={'Matching Colors'}
            materials={this.state.materials}
            onReplace={this.replaceMaterial}
            selected={this.state.selected}
            thumbnails={this.state.thumbnails}
          />
          <ColorDetailsForm
            material={currentMaterial}
            onApply={this.updateState}
          />
        </div>
        <div className="App-footer">
          {statusmsg}
        </div>
      </div>
    );
  }
}

export default App;
