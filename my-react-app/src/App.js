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
    if (!e instanceof ReferenceError) {
      // 'sketchup is not defined'
      console.error(e);
    } else {
      const data = browser_action(action);
      // eslint-disable-next-line
      global.update_data({ ...data });
    }
  }
}

// replace error, materials and status but update thumbnails
function mergeProps(state, newProps = {}) {
  return {
    error: newProps.error || '',
    materials: newProps.materials || state.materials || {},
    status: newProps.status || state.status || '',
    thumbnails: Object.assign({}, state.thumbnails, newProps.thumbnails)
  };
}

function formatStatus(error = '', status = '') {
  return error ? <span className="error">{error}</span> : status;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      match: '',
      error: '',
      materials: {},
      source: '',
      status: '',
      thumbnails: {}
    };

    this.replaceMaterial = this.replaceMaterial.bind(this);
    this.selectMatch = this.selectMatch.bind(this);
    this.selectMaterial = this.selectMaterial.bind(this);
  }

  // load materials immediately after app component is created
  // and set timeout to load thumbnails
  componentDidMount() {
    console.log('componentDidMount');
    sketchupAction({ type: 'LOAD_MATERIALS' });
    setTimeout(() => sketchupAction({ type: 'LOAD_THUMBNAILS' }), 500);
  }

  // update state with new state received via nextProps
  componentWillReceiveProps(nextProps = {}) {
    const merged = mergeProps(this.state, nextProps.data);
    this.setState(merged);
  }

  // set name of selected color in 'matching' list
  selectMatch(name) {
    this.setState(
      { match: name, error: '', status: `match material ${name}` },
      () => console.log(`selected match material '${name}'`)
    );
  }

  // set name of source material
  selectMaterial(name) {
    this.setState(
      {
        source: name,
        match: '',
        error: '',
        status: `selected source material '${name}'`
      },
      () => console.log(`selected source material '${name}'`)
    );
  }

  // trigger action to replace match material with source material
  replaceMaterial(name) {
    if (!this.state.source) {
      return;
    }

    // update the state to provide user feedback
    this.setState(
      {
        error: '',
        status: `replacing material '${name}' with '${this.state.source}'`
      },
      () => console.log(`replaceMaterial(${name})`)
    );

    // call sketchup.su_action with the correct action
    sketchupAction({
      type: 'REPLACE_MATERIAL',
      payload: {
        replace: name,
        replace_with: this.state.source,
        // adding materials to simulate update via browser_action
        materials: this.state.materials
      }
    });
  }

  render() {
    const statusmsg = formatStatus(this.state.error, this.state.status);

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React Color Manager</h2>
        </div>

        <div className="App-body">
          <ColorList
            title={'Source List'}
            materials={this.state.materials}
            onClick={this.selectMaterial}
            source={this.state.source}
            thumbnail={this.state.thumbnails[this.state.source]}
          />

          <ColorDiffList
            title={'Matching Colors'}
            match={this.state.match}
            materials={this.state.materials}
            onClick={this.selectMatch}
            onReplace={this.replaceMaterial}
            source={this.state.source}
            thumbnails={this.state.thumbnails}
          />

          <ColorDetails
            source={this.state.materials[this.state.source] || {}} 
            match={this.state.materials[this.state.match] || {}}
          />
        </div>

        <div className="App-footer">{statusmsg}</div>
      </div>
    );
  }
}

export default App;
