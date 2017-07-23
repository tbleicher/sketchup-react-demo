require 'sketchup.rb'
require 'extensions.rb'

reactdemo = SketchupExtension.new('SketchUp React Demo', 'sketchup-react-demo/main.rb')
reactdemo.version = '1.0'
reactdemo.description = 'Example of HtmlDialog with React.js.'
Sketchup.register_extension(reactdemo, true)
