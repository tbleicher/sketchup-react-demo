## Structure of the SketchUp Extension

Before we dive into the Javascript side of things, let's set out the basic file structure for the extension:

    +- sketchup-react-demo.rb
    +- sketchup-react-demo/
    |  +- main.rb
    |  +- dialog.rb
    |  +- html/
    |  |  +- index.html
    |  |  +- static/
    |  |  |  +- css/ 
    |  |  |  +- js/
    |  |  |  +- media/
    |  |  +- [other html related files]
    |  +- [other Ruby related files]

At the top level we have a `sketchup-react-demo.rb` file which will register the extension. See [the extension example](http://ruby.sketchup.com/SketchupExtension.html) in the Sketchup Ruby API documentation for details. Next to the file we have a `sketchup-react-demo` directory with all the files related to our extension (Ruby scripts and others). By convention the names of the Ruby file and the extensioion directory should match.

All files for HTML and Javascript content of the HtmlDialog are kept in the `html` directory. We will set up our React project in a way that allows us to copy the finished app into this directory without further modifications. That way we can use the superior React development environment to create the HTML content and don't have to go back and forth between Ruby and Javascript.

### main.rb

Within the extension directory you will most likely have a file to do the initial setup of your extensions's functionality. Here you typically load other Ruby files and create entries in the SketchUp menu for your features. We load the file `dialog.rb` and create an entry in the *Extensions* menu to show the HtmlDialog window.

```ruby
# sketchup-react-demo/main.rb
$:.push(File.dirname(__FILE__))
require 'dialog.rb'

module SketchupReactDemo
  module_function
  def addMenu
    plugins = UI.menu("Extensions")
    plugins.add_item("SketchUp React Demo") { SkethupReactDemo::show_dialog }
  end
end

# create menu entry only the first time the file is loaded
if (not file_loaded?("sketchup-react-demo"))
  SketchupReactDemo::addMenu()
  file_loaded("sketchup-react-demo")
end   
```

### dialog.rb

In the `dialog.rb` file we create and show the HtmlDialog window. Some additional magic needs to happen here because SketchUp uses a temporary directory as the base for any HTML content. This will break paths to images and other files that we want to included in our dialog.

We need to set an explicit `<base href="...">` tag in the header with the full path to the directory that contains our HTML files. When we set up our React app we will add a placeholder for the base url path to the `index.html` template (see below). Then we can use Ruby to read this file as a string and substitute the `BASEURL` placeholder with the full path of our extension directory.

```ruby
# sketchup-react-demo/dialog.rb
module SketchupReactDemo
  module_function

  def show_dialog
    # load html from index.html and replace BASEURL with the current directory
    basedir = File.dirname(File.expand_path(__FILE__))
    html = File.read(File.join(basedir, "html", "index.html")).sub("BASEURL", basedir)

    # set options
    options = {
      :dialog_title => "Sketchup React Demo",
      # more options
      :style => UI::HtmlDialog::STYLE_DIALOG
    }
    
    # create and show the UI::HtmlDialog instance
    dlg = UI::HtmlDialog.new(options);
    dlg.set_html html
    dlg.show
  end
end
```