import React from 'react';

function SimpleInput({ id, onChange=()=>{}, value = '', type = 'text' }) {
  return (<input 
    id={id} 
    onChange={onChange} 
    value={value}
    type={type} />
  );
}

export default SimpleInput;
