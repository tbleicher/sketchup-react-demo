// browser_action.js

// replacements for functions executed by SketchUp
// used during testing of React development 

function testMaterial(name) {
  const r = parseInt(Math.random() * 256, 10);
  const g = parseInt(Math.random() * 256, 10);
  const b = parseInt(Math.random() * 256, 10);
  return {
    name,
    display_name: name,
    color: `Color(${r}, ${g}, ${b}, 255)`,
    red: r,
    green: g,
    blue: b,
    texture: '',
    alpha: 1.0,
    materialType: 'solid',
    colorize_deltas: '0.000 - 0.000 - 0.000',
    colorize_type: 'shift'
  };
}

const testMaterials = {};
'Material1 two M3 four five six seven eight nine ten a11 b12 c13 d14 e15 f16 g17'
  .split(' ')
  .forEach(s => {
    testMaterials[s] = testMaterial(s);
  });

function replace_action(payload) {
  const replace = payload.replace;
  const materials = Object.assign({}, payload.materials);
  delete materials[replace];
  const status = `replaced material ${payload.replace} with ${payload.replace_with}`;
  return { status, materials };
}

function browser_action(action) {
  switch (action.action) {
    case 'LOAD_MATERIALS':
      return {
        status: 'loaded materials list',
        materials: testMaterials,
        error: ''
      };
    case 'LOAD_THUMBNAIL':
      return {
        status: `loaded thumbnail for material '${action.payload}'`,
        error: ''
      };
    case 'LOAD_THUMBNAILS':
      return {
        status: 'loaded all thumbnails',
        error: ''
      };
    case 'REPLACE_MATERIAL':
      return replace_action(action.payload);
    default:
      return {};
  }
}

export {browser_action, testMaterials};