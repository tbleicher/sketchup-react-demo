import React from 'react';

import './ColorList.css';

function ColorList({ title='Materials', materials = [], onSelect = () => {}, selected = '' }) {
  const list = materials.map(name => {
    const clsName = (name === selected) ? 'selected' : '';

    return (
      <li key={name} className={clsName} onClick={() => onSelect(name)}>
        {name}
      </li>
    );
  });

  return (
    <div id="color_list">
      <h4>{title}</h4>
      <div id="wrapper">
        <ul>
          {list}
        </ul>
      </div>
      <div id="preview_source">
        {navigator.userAgent}
      </div>
    </div>
  );
}

export default ColorList;
