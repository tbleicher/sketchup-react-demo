import React, { Component } from 'react';

import ColorDetails from './components/ColorDetails';
import ColorList from './components/ColorList';
import ColorDiffList from './components/ColorDiffList';

import { browser_action } from './browser_action';

import logo from './logo.svg';
import './App.css';

//declare 'sketchup' object as global to stop ESLint errors
/*global sketchup*/

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
      const data = browser_action(action);
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
  return error ? <span className="error">{error}</span> : status;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: '',
      error: '',
      materials: {},
      source: '',
      status: '',
      thumbnails: {}
    };

    this.replaceMaterial = this.replaceMaterial.bind(this);
    this.selectCurrent = this.selectCurrent.bind(this);
    this.selectMaterial = this.selectMaterial.bind(this);
  }

  // load materials immediately after app component is created
  // and set timeout to load thumbnails
  componentDidMount() {
    console.log('componentDidMount');
    sketchupAction({ action: 'LOAD_MATERIALS' });
    setTimeout(() => sketchupAction({ action: 'LOAD_THUMBNAILS' }), 500);
  }

  // update state with new state received via nextProps
  componentWillReceiveProps(nextProps = {}) {
    const merged = mergeProps(this.state, nextProps.data);
    this.setState(merged);
  }

  // set name of selected color in 'matching' list
  selectCurrent(name) {
    this.setState(
      { current: name, error: '', status: `current material ${name}` },
      () => console.log(`selected current material '${name}'`)
    );
  }

  // set name of source material
  selectMaterial(name) {
    this.setState(
      {
        source: name,
        current: '',
        error: '',
        status: `selected source material '${name}'`
      },
      () => console.log(`selected source material '${name}'`)
    );
  }

  // trigger action to replace current material with source material
  replaceMaterial(name) {
    if (this.state.source) {
      console.log(`replaceMaterial(${name})`);
      this.setState({
        error: '',
        status: `replacing material '${name}' with '${this.state.source}'`
      });
      sketchupAction({
        action: 'REPLACE_MATERIAL',
        payload: {
          replace: name,
          replace_with: this.state.source,
          // adding materials to simulate update via browser_action
          materials: this.state.materials
        }
      });
    }
  }

  render() {
    const currentMaterial = this.state.materials[this.state.current] || {};
    const selectedMaterial = this.state.materials[this.state.source] || {};
    const statusmsg = formatStatus(this.state.error, this.state.status);

    const list = Object.keys(this.state.materials).length ? (
      <ColorList
        title={'Source List'}
        materials={this.state.materials}
        onSelect={this.selectMaterial}
        source={this.state.source}
        thumbnail={this.state.thumbnails[this.state.source]}
      />
    ) : (
      <span onClick={() => sketchupAction({ action: 'LOAD_MATERIALS' })}>
        load materials
      </span>
    );

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
            current={this.state.current}
            materials={this.state.materials}
            onCurrent={this.selectCurrent}
            onReplace={this.replaceMaterial}
            source={this.state.source}
            thumbnails={this.state.thumbnails}
          />
          <ColorDetails source={selectedMaterial} current={currentMaterial} />
        </div>
        <div className="App-footer">{statusmsg}</div>
      </div>
    );
  }
}

export default App;
