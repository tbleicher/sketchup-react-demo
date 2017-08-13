import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//declare 'sketchup' object as global to stop ESLint errors
/*global sketchup*/

function sketchupAction() {
  // show sketchup object in browser console
  console.log('sketchup Object:');
  console.log(sketchup);
  sketchup.su_action('Hello World', 42);
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p><button onClick={sketchupAction}>Trigger su_action!</button></p>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
