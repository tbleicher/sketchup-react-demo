import React from 'react';
import { diff, rgb_to_lab } from 'color-diff';

import './ColorDiffList.css';

//console.log(diff);

function imgSrcFromBase64(data) {
  return (
    <img src={`data:image/png;base64, ${data}`} alt="material thumbnail" />
  );
}

function color_diff(ref, m) {
  if (!ref) {
    return 0;
  }
  const ref_lab = rgb_to_lab({ R: ref.red, G: ref.green, B: ref.blue });
  const m_lab = rgb_to_lab({ R: m.red, G: m.green, B: m.blue });
  return diff(ref_lab, m_lab);
}

function ColorDiffList({
  title = 'Matching Colors',
  materials = {},
  onSelect = () => {},
  selected = '',
  thumbnail = ''
}) {
  const list = Object.keys(materials)
    .map(name => materials[name])
    .filter(m => m.name !== selected)
    .map(m => Object.assign({}, m, {diff: color_diff(materials[selected], m)}))
    .sort((a, b) => a.diff - b.diff)
    .map(m => {
    return (
      <li key={m.name} onClick={() => onSelect(m.name)}>
        <img width={64} height={64} alt="thumbnail" />
        {m.display_name || m.name}<br/>
        <span className="cdiff">
          {m.color}<br/>
          {m.texture}<br/>
          {m.diff.toFixed(3)}
        </span>
      </li>
    );
  });
  const tn = thumbnail ? imgSrcFromBase64(thumbnail) : 'todo: img';

  return (
    <div id="color_diff_list">
      <h4>
        {title}
      </h4>
      <div className="wrapper">
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

export default ColorDiffList;
