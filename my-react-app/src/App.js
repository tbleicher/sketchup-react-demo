import React, { Component } from 'react';

import ColorDetails from './components/ColorDetails';
import ColorList from './components/ColorList';
import ColorDiffList from './components/ColorDiffList';

import browser_action from './browser_action';

import logo from './logo.svg';
import './App.css';

//declare 'sketchup' object as global to stop ESLint errors
/*global sketchup*/

function sketchupAction(action) {
  console.log('action:', JSON.stringify(action, null, 2));
  try {
    sketchup.su_action(action);
  } catch (e) {
    // ignore 'sketchup is not defined' in development
    // but report other errors
    if (!e instanceof ReferenceError) {
      console.error(e);
    } else {
      const data = browser_action(action);
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
    console.log('componentDidMount - loading materials ...');
    this.setState({state: 'loading materials ...'});
    sketchupAction({ type: 'LOAD_MATERIALS' });
    setTimeout(() => sketchupAction({ type: 'LOAD_THUMBNAILS' }), 500);
  }

  // update state with new state received via nextProps
  componentWillReceiveProps(nextProps = {}) {
    const merged = mergeProps(this.state, nextProps.data);
    this.setState(merged);
  }

  // set name of color selected in 'matching' list
  selectMatch(name) {
    this.setState(
      {
        match: name, 
        status: `match material ${name}`
      },
      () => console.log(`selected match material '${name}'`)
    );
  }

  // set name of source material and reset match selection
  selectMaterial(name) {
    this.setState(
      {
        source: name,
        match: '',
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
        status: `replacing material '${name}' with '${this.state.source}'`
      },
      () => console.log(`replaceMaterial(${name})`)
    );

    // call sketchup.su_action with the correct action
    sketchupAction({
      type: 'REPLACE_MATERIAL',
      payload: {
        replace: name,
        replace_with: this.state.source
      }
    });
  }

  render() {
    const statusmsg =
      this.state.status === 'ERROR' ? (
        <span className="error">{this.state.error}</span>
      ) : (
        this.state.status
      );

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
