# sketchup-react-demo/main.rb
$:.push(File.dirname(__FILE__))
require 'material.rb'
require 'dialog.rb'

module SketchupReactDemo
  module_function

  def addDemoMenu
    plugins = UI.menu("Extensions")
    plugins.add_item("HtmlDialog Demo") { SketchupReactDemo::show_dialog }
  end
end

# create menu entry
begin
  if (not file_loaded?("sketchup-react-demo"))
    SketchupReactDemo::addDemoMenu()
  end
rescue => e
  msg = "%s\n\n%s" % [$!.message,e.backtrace.join("\n")]
  UI.messagebox msg
  printf "entry to menu 'Plugin' failed:\n\n%s\n" % msg
end
file_loaded("sketchup-react-demo")