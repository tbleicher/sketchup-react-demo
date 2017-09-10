// browser_action.js

// replacements for functions executed by SketchUp
// used during testing of React development

const names = 'M1 two M3 four five six seven a11 b12 c13 d14 e15 f16 g17';

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

function materialsMock(names) {
  const testMaterials = {};
  names.split(' ').forEach(s => {
    testMaterials[s] = testMaterial(s);
  });

  return {
    list: () => Object.assign({}, testMaterials),
    remove: name => {
      delete testMaterials[name];
      return Object.assign({}, testMaterials);
    }
  };
}

const materials = materialsMock(names);

function browser_action(action) {
  switch (action.type) {
    case 'LOAD_MATERIALS':
      return {
        materials: materials.list(),
        status: 'loaded materials list'
      };
    case 'LOAD_THUMBNAIL':
      return {
        thumbnails: {},
        status: `loaded thumbnail for material '${action.payload}'`
      };
    case 'LOAD_THUMBNAILS':
      return {
        thumbnails: {},
        status: 'loaded all thumbnails'
      };
    case 'REPLACE_MATERIAL':
      return action.payload.replace[0] === 'M'
        ? {
            error: `error replacing material '${action.payload.replace}'`,
            status: 'ERROR'
          }
        : {
            materials: materials.remove(action.payload.replace),
            status: `replaced ${action.payload.replace} with ${action.payload
              .replace_with}`
          };
    default:
      return {};
  }
}

export { browser_action };
