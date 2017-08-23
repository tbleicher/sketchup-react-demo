const fs = require('fs-extra');
const path = require('path');

const home = process.env.HOME;
const su2017 = ['SketchUp 2017', 'SketchUp', 'Plugins'];

let path_dirs;
if (process.platform === 'darwin') {
  path_dirs = [home].concat(['Library', 'Application Support'], su2017);
} else {
  path_dirs = [home].concat(['AppData', 'Roaming', 'SketchUp'], su2017);
}
const PLUGINS = path_dirs.join(path.sep);

// ruby files
const files = [
  ['../sketchup-react-demo.rb', 'sketchup-react-demo.rb'],
  ['../sketchup-react-demo', 'sketchup-react-demo']
];

// list html assets from 'build'
fs.readdirSync('./build').forEach(file => {
  files.push([
    ['.', 'build', file].join(path.sep),
    ['sketchup-react-demo', 'html', file].join(path.sep)
  ]);
});

// copy files to PLUGINS dir
const htmldir = [PLUGINS, 'sketchup-react-demo', 'html'].join(path.sep);
fs
  .remove(htmldir)
  .then(() => {
    console.log(`removed ${htmldir}`);
  })
  .then(() => {
    fs.ensureDir(htmldir);
  })
  .then(() => {
    files.forEach(([source, target]) => {
      try {
        fs.copySync(source, [PLUGINS, target].join(path.sep));
        console.log(`copied ${source} to ${PLUGINS}/${target}`);
      } catch (err) {
        console.error(err);
      }
    });
  })
  .catch(err => {
    console.error(err);
  });
