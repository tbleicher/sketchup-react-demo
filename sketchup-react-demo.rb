require 'sketchup.rb'
require 'extensions.rb'

reactdemo = SketchupExtension.new('SketchUp React Demo', 'sketchup-react-demo/main.rb')
reactdemo.creator = 'tbleicher@gmail.com'
reactdemo.copyright = 'Thomas Bleicher 2017'
reactdemo.version = '0.1.1'
reactdemo.description = 'Example of HtmlDialog with React.js.'
Sketchup.register_extension(reactdemo, true)
