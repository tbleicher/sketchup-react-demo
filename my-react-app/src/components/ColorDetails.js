import React from 'react';

import './ColorDetails.css';

const options = [
  'name',
  'color',
  'texture',
  'materialType',
  'colorize_deltas',
  'colorize_type'
];

function attribute_group(a, source, current) {
  return source[a] && current[a] ? (
    <div className="detail" key={`attribute_${a}`}>
      <div className="attribute">{a}</div>
      <div className="source">{source[a]}</div>
      <div className="current">{current[a]}</div>
    </div>
  ) : (
    ''
  );
}

function ColorDetails({
  title = 'Color Details',
  source = {},
  current = {}
}) {
  const details = options.map(a => attribute_group(a, source, current));
  return (
    <div id="color_details">
      <h4>{title}</h4>
      {details}
    </div>
  );
}

export default ColorDetails;
