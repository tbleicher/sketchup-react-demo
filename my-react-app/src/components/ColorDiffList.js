import React from 'react';
import { diff, rgb_to_lab } from 'color-diff';

import './ColorDiffList.css';
import logo from '../logo.svg';

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

function replace_link(n, onReplace) {
  return (n === 0) ? '' : <span onClick={() => onReplace()}>replace</span>;
}

function ColorDiffList({
  title = 'Matching Colors',
  materials = {},
  onReplace = () => {},
  selected = '',
  thumbnails = {}
}) {
  const list = Object.keys(materials)
    .map(name => materials[name])
    .filter(m => m.name !== selected)
    .map(m =>
      Object.assign({}, m, {
        diff: color_diff(materials[selected], m),
        thumbnail: thumbnails[m.name]
      })
    )
    .sort((a, b) => a.diff - b.diff)
    .map(m => {
      return (
        <li key={m.name}>
          {m.thumbnail
            ? imgSrcFromBase64(m.thumbnail)
            : <img src={logo} width={64} height={64} alt="thumbnail" />}
          {m.display_name || m.name}
          <br />
          <span className="cdiff">
            {m.color}
            <br />
            {m.texture}
            <br />
            {replace_link(m.diff, ()=> onReplace(m.name) )}
          </span>
        </li>
      );
    });

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
    </div>
  );
}

export default ColorDiffList;
