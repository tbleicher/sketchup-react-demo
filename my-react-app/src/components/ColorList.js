import React from 'react';

import './ColorList.css';

function imgSrcFromBase64(data) {
  return (<img src={`data:image/png;base64, ${data}`} alt="material thumbnail" />)
}


function ColorList({ title='Materials', materials = [], onSelect = () => {}, selected = '', thumbnail = ''}) {
  const list = materials.map(name => {
    const clsName = (name === selected) ? 'selected' : '';
    return (
      <li key={name} className={clsName} onClick={() => onSelect(name)}>
        {name}
      </li>
    );
  });
  const tn = thumbnail ? imgSrcFromBase64(thumbnail) : 'todo: img';
  
  return (
    <div id="color_list">
      <h4>{title}</h4>
      <div id="wrapper">
        <ul>
          {list}
        </ul>
      </div>
      <div id="preview_source">
        {tn}
      </div>
    </div>
  );
}

export default ColorList;
