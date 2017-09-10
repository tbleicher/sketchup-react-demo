import React from 'react';

import './ColorList.css';
import logo from '../logo.svg';

function imgSrcFromBase64(data) {
  return (
    <img src={`data:image/png;base64, ${data}`} alt="material thumbnail" />
  );
}

function ColorList({
  title = 'Materials',
  materials = {},
  onClick = () => {},
  source = '',
  thumbnail = ''
}) {
  const list = Object.keys(materials)
    .map(name => materials[name])
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(m => {
      const clsName = m.name === source ? 'source' : '';
      return (
        <li key={m.name} className={clsName} onClick={() => onClick(m.name)}>
          {m.display_name || m.name}
        </li>
      );
    });
    
  const tn = thumbnail
    ? imgSrcFromBase64(thumbnail)
    : <img src={logo} width={128} height={128} alt="thumbnail" />;

  return (
    <div id="color_list">
      <h4>
        {title}
      </h4>
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
