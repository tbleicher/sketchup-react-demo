import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';

function logData(newData) {
  const data = Object.keys(newData).map(k => {
    if (k === 'status' || k === 'error') {
      return `"${k}": "${newData[k]}"`;
    } else {
      return `"${k}": [${Object.keys(newData[k]).length} ${k}]`;
    }
  });
  console.log(`{\n  ${data.join(",\n  ")}\n}`);
}

// eslint-disable-next-line
global.update_data = function(newData) {
  console.log('=> update_data');
  logData(newData);
  ReactDOM.render(<App data={newData} />, document.getElementById('root'));
}

ReactDOM.render(<App data={{}} />, document.getElementById('root'));
//registerServiceWorker();
