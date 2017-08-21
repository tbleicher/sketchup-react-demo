import React from 'react';

import './ColorList.css';

function ColorList({ materials = [], onSelect = () => {}, selected = '' }) {
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
      <h4>Color List</h4>
      <ul>
        {list}
      </ul>
    </div>
  );
}

export default ColorList;
