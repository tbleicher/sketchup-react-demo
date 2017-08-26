import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';

var store = { colors: [], number: 42, string: 'Hello, World!' };

// eslint-disable-next-line
global.update_data = function(data) {
  console.log('=> update_data');
  console.log(JSON.stringify(data, null, 2));
  store = Object.assign({}, store, data);
  ReactDOM.render(<App store={store} />, document.getElementById('root'));
}

ReactDOM.render(<App store={store} />, document.getElementById('root'));
//registerServiceWorker();
