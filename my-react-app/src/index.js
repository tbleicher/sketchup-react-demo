import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';

var data = {
  error: '', 
  materials: {},
  status: '',
  thumbnails: {}
};

// eslint-disable-next-line
global.update_data = function(newData) {
  console.log('=> update_data');
  console.log(JSON.stringify(Object.keys(newData), null, 2));
  ReactDOM.render(<App data={newData} />, document.getElementById('root'));
}

ReactDOM.render(<App data={data} />, document.getElementById('root'));
//registerServiceWorker();
